import { Image } from '../types/image.js';
import { User } from './user.js';

export type Car = {
  id: string;
  owner: User;
  typeCar: 'Historic' | 'TvMovie' | 'RareCar';
  brand: string;
  country: string;
  carModel: string;
  image: Image;
};
