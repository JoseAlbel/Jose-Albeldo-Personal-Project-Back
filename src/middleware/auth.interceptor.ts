import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import { AuthServices, PayloadToken } from '../services/auth.js';

import createDebug from 'debug';
import { CarRepo } from '../repository/car.m.repository.js';
const debug = createDebug('NANOFP:AuthInterceptor');
export class AuthInterceptor {
  // eslint-disable-next-line no-unused-vars
  constructor(private CarRepo: CarRepo) {
    debug('Instantiated');
  }

  logged(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.get('Authorization');
      if (!authHeader) {
        throw new HttpError(401, 'Not Authorized', 'Not Authorization header');
      }

      if (!authHeader.startsWith('Bearer')) {
        throw new HttpError(
          401,
          'Not Authorized',
          'Not Bearer in Authorization header'
        );
      }

      console.log(req.body);

      const token = authHeader.slice(7);
      const payload = AuthServices.verifyJWTGettingPayload(token);

      req.body.tokenPayload = payload;
      next();
    } catch (error) {
      next(error);
    }
  }

  async authorizedForCars(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.tokenPayload) {
        throw new HttpError(
          498,
          'Token not found',
          'Token not found in Authorized interceptor'
        );
      }

      const { id: userID } = req.body.tokenPayload as PayloadToken;
      const { id: carId } = req.params;

      const car = await this.CarRepo.queryById(carId);

      if (car.owner.id !== userID) {
        throw new HttpError(401, 'Not authorized', 'Not authorized');
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
