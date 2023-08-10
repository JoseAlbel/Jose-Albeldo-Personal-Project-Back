import { Repository } from './repository.js';
import { Car } from '../entities/car.js';
import { CarModel } from './car.m.model.js';
import createDebug from 'debug';
import { HttpError } from '../types/http.error.js';

const debug = createDebug('NANOFP:CarRepo');

export class CarRepo implements Repository<Car> {
  constructor() {
    debug('Instantiaded', CarModel);
  }

  async query(): Promise<Car[]> {
    const wholeData = await CarModel.find().exec();
    return wholeData;
  }

  async queryById(id: string): Promise<Car> {
    const result = await CarModel.findById(id).exec();
    if (result === null)
      throw new HttpError(404, 'Not found', 'Wrong id for the query');
    return result;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<Car[]> {
    const result = await CarModel.find({ [key]: value }).exec();
    return result;
  }

  async create(data: Omit<Car, 'id'>): Promise<Car> {
    const newCar = await CarModel.create(data);
    return newCar;
  }

  async update(id: string, data: Partial<Car>): Promise<Car> {
    const newCar = await CarModel.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();
    if (newCar === null)
      throw new HttpError(404, 'Not found', 'Wrong id for the update');
    return newCar;
  }

  async delete(id: string): Promise<void> {
    const result = await CarModel.findByIdAndDelete(id).exec();
    if (result === null)
      throw new HttpError(404, 'Not found', 'Wrong id for the delete');
  }
}
