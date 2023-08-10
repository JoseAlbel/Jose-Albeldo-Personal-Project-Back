import { Car } from './car';
import joi from 'joi';

export type User = {
  cars: Car[];
  id: string;
  userName: string;
  email: string;
  passwd: string;
};
export const userSchema = joi.object<User>({
  userName: joi.string().required(),

  passwd: joi
    .string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required(),
});
