import { NextFunction, Request, Response } from 'express';
import { AuthServices, PayloadToken } from '../services/auth';
import { AuthInterceptor } from './auth.interceptor';
import { CarRepo } from '../repository/car.m.repository';
import { HttpError } from '../types/http.error';

jest.mock('../services/auth');

describe('Given the AuthInterceptor middleware', () => {
  describe('When it is instantiated', () => {
    const mockRepo = {} as unknown as CarRepo;
    const mockPayload = {} as PayloadToken;
    const req = {
      body: { tokenPayload: mockPayload },
    } as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn() as NextFunction;
    const interceptor = new AuthInterceptor(mockRepo);

    test('Then the logged method should be used', () => {
      req.get = jest.fn().mockReturnValueOnce('Bearer test');
      (AuthServices.verifyJWTGettingPayload as jest.Mock).mockResolvedValueOnce(
        mockPayload
      );
      interceptor.logged(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then the logged method should throw an error when there is no authHeader', () => {
      const error = new HttpError(
        401,
        'Not Authorized',
        'Not Authorization header'
      );
      (AuthServices.verifyJWTGettingPayload as jest.Mock).mockResolvedValueOnce(
        mockPayload
      );
      interceptor.logged(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    test('Then the logged method should throw an error when authHeader does not start with Bearer', () => {
      const error = new HttpError(
        401,
        'Not Authorized',
        'Not Bearer in Authorization header'
      );
      req.get = jest.fn().mockReturnValueOnce('No Bearer');
      (AuthServices.verifyJWTGettingPayload as jest.Mock).mockResolvedValueOnce(
        mockPayload
      );
      interceptor.logged(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When it is instantiated', () => {
    const mockCarRepo = {
      queryById: jest.fn().mockResolvedValue({ owner: { id: '6' } }),
    } as unknown as CarRepo;
    const mockPayload = { id: '6' } as PayloadToken;
    const mockCarId = '2';
    const req = {
      body: { tokenPayload: mockPayload },
      params: { id: mockCarId },
    } as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn() as NextFunction;
    const authInterceptor = new AuthInterceptor(mockCarRepo);

    test('Then the authorizedForCars method should be used', async () => {
      authInterceptor.authorizedForCars(req, res, next);
      await expect(mockCarRepo.queryById).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    test('Then the authorizedForCars method should throw an error when there is no token in the body', () => {
      const error = new HttpError(
        498,
        'Token not found',
        'Token not found in Authorized interceptor'
      );
      const mockPayload = null;
      const req = {
        body: { tokenPayload: mockPayload },
      } as unknown as Request;

      authInterceptor.authorizedForCars(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    test('Then the authorizedForCars method should throw an error when the car owner id does not match with the id from the request params', async () => {
      const error = new HttpError(401, 'Not authorized', 'Not authorized');
      const mockUserId = { id: '7' };
      const mockCarId = { id: '3', owner: { id: '6' } };
      const req = {
        body: { tokenPayload: mockUserId },
        params: mockCarId,
      } as unknown as Request;

      authInterceptor.authorizedForCars(req, res, next);
      await expect(mockCarRepo.queryById).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
