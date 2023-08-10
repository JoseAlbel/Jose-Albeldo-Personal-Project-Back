import { Schema, model } from 'mongoose';
import { Car } from '../entities/car.js';

const carSchema = new Schema<Car>({
  image: {
    type: {
      urlOriginal: { type: String },
      url: { type: String },
      mimetype: { type: String },
      size: { type: Number },
    },
    required: false,
    trim: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  // typeCar: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  carModel: { type: String, required: true, trim: true },
});

carSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject._id;
    delete returnedObject.passwd;
  },
});

export const CarModel = model('Car', carSchema, 'cars');
