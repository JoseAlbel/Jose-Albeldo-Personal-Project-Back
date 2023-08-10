import { Router as createRouter } from 'express';
import { CarController } from '../controllers/car.controller.js';
import { CarRepo } from '../repository/car.m.repository.js';
import { Repository } from '../repository/repository.js';
import { Car } from '../entities/car.js';

import createDebug from 'debug';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { UserRepo } from '../repository/user.m.repository.js';
import { FileMiddleware } from '../middleware/files.js';
import { User } from '../entities/user.js';
const debug = createDebug('NANOFP:CarRouter');

debug('Executed');

const repo: Repository<Car> = new CarRepo();
const userRepo: Repository<User> = new UserRepo();
const controller = new CarController(repo, userRepo);
const interceptor = new AuthInterceptor(repo);
const auth = new AuthInterceptor(repo);
const fileServices = new FileMiddleware();
export const carRouter = createRouter();

carRouter.get('/', controller.getAll.bind(controller));
carRouter.get('/:id', controller.getById.bind(controller));
carRouter.post(
  '/',
  fileServices.singleFileStore('image').bind(fileServices),
  auth.logged.bind(auth),
  fileServices.optimization.bind(fileServices),
  fileServices.saveImage.bind(fileServices),
  controller.post.bind(controller)
);
carRouter.patch(
  '/:id',
  interceptor.logged.bind(interceptor),
  interceptor.authorizedForCars.bind(interceptor),
  controller.patch.bind(controller)
);
carRouter.delete(
  '/:id',
  interceptor.logged.bind(interceptor),
  interceptor.authorizedForCars.bind(interceptor),
  controller.deleteById.bind(controller)
);
