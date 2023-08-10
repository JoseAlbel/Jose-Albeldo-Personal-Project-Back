import { NextFunction, Request, Response } from 'express';
import { CarRepo } from '../repository/car.m.repository.js';
import { Controller } from './controller.js';
import { Car } from '../entities/car.js';

import createDebug from 'debug';
import { PayloadToken } from '../services/auth.js';
import { UserRepo } from '../repository/user.m.repository.js';
import { CarModel } from '../repository/car.m.model.js';
const debug = createDebug('NANOFP:CarController');

export class CarController extends Controller<Car> {
  // eslint-disable-next-line no-unused-vars
  constructor(public repo: CarRepo, private userRepo: UserRepo) {
    super();
    debug('Instantiated');
  }

  async post(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('BODYCAR', req.body);
      const { id: userId } = req.body.tokenPayload as PayloadToken;
      const user = await this.userRepo.queryById(userId);
      delete req.body.tokenPayload;
      req.body.owner = userId;
      const newCar = await this.repo.create(req.body);
      console.log(newCar);
      // A user.Cars.push(newCar)
      this.userRepo.update(user.id, user);
      res.status(201);
      res.send(newCar);
    } catch (error) {
      next(error);
      console.log('Error');
    }
  }

  async deleteByid(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('BODY', req.body);

      const { id: userId } = req.body.tokenPayload as PayloadToken;
      console.log(userId);
      const Car = await CarModel.findById(req.params.id);

      if (Car && userId === Car.owner.toString()) {
        await CarModel.findByIdAndDelete(req.params.id);
        res.status(201).send(Car);
      } else {
        res.status(403).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      next(error);
    }
  }
}
