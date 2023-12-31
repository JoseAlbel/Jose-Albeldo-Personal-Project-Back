import { UserModel } from './user.m.model.js';
import createDebug from 'debug';
import { User } from '../entities/user.js';
import { HttpError } from '../types/http.error.js';
import { Repository } from './repository.js';

// TEMP import { HttpError } from '../types/http.error.js';
const debug = createDebug('NANOFP:UserRepo');

export class UserRepo implements Repository<User> {
  constructor() {
    debug('Instantiated', UserModel);
  }

  async query(): Promise<User[]> {
    const wholeData = await UserModel.find().exec();
    return wholeData;
  }

  async queryById(id: string): Promise<User> {
    const result = await UserModel.findById(id).exec();
    if (result === null)
      throw new HttpError(404, 'Not found', 'Bad id for the query');
    return result;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<User[]> {
    const result = await UserModel.find({ [key]: value }).exec();
    return result;
  }

  async create(data: Omit<User, 'id'>): Promise<User> {
    const newUser = await UserModel.create(data);
    return newUser;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const newUser = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();
    if (newUser === null)
      throw new HttpError(404, 'Not found', 'Bad id for the update');
    return newUser;
  }

  async delete(id: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    if (result === null)
      throw new HttpError(404, 'Not found', 'Bad id for the delete');
  }
}
