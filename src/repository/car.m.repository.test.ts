import { Car } from '../entities/car';
import { HttpError } from '../types/http.error';
import { CarModel } from './car.m.model';
import { CarRepo } from './car.m.repository';

jest.mock('./car.m.model');

describe('Given the CarRepo class', () => {
  const mockRepo = new CarRepo();
  describe('When it is instantiated', () => {
    test('Then the query method should be used', async () => {
      const mockData = [{}];
      const exec = jest.fn().mockResolvedValueOnce(mockData);

      CarModel.find = jest.fn().mockReturnValueOnce({
        exec,
      });

      const result = await mockRepo.query();
      expect(CarModel.find).toHaveBeenCalled();
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    test('Then the queryById method should be used', async () => {
      const mockCar = { id: '1', carModel: 'F40' };
      const mockId = '1';
      const exec = jest.fn().mockResolvedValue(mockCar);
      CarModel.findById = jest.fn().mockReturnValueOnce({
        exec,
      });

      const result = await mockRepo.queryById(mockId);
      expect(CarModel.findById).toHaveBeenCalled();
      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockCar);
    });

    test('Then the create method should be used', async () => {
      const mockCar = {
        id: '1',
        owner: {},
        typeCar: 'TvMovie',
        brand: 'N.D',
        country: 'UU.EE',
        carModel: 'BatmanCar',
        image: {},
      } as unknown as Car;

      (CarModel.create as jest.Mock).mockReturnValueOnce(mockCar);
      const result = await mockRepo.create(mockCar);
      expect(CarModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockCar);
    });

    test('Then the update method should be used', async () => {
      const mockId = '7';
      const mockCar = {
        id: '7',
        carModel: 'Shelby Cobra',
      };
      const mockUpdatedCar = {
        id: '7',
        carModel: 'Shelby Serpiente',
      };

      const exec = jest.fn().mockResolvedValueOnce(mockUpdatedCar);
      CarModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec,
      });

      const result = await mockRepo.update(mockId, mockCar);
      expect(CarModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual(mockUpdatedCar);
    });

    test('Then the search method should be used', async () => {
      const mockCar = [{ id: '3', carModel: 'Barbie Car' }];

      const exec = jest.fn().mockResolvedValueOnce(mockCar);
      CarModel.find = jest.fn().mockReturnValueOnce({
        exec,
      });

      const result = await mockRepo.search({
        key: 'carModel',
        value: 'Barbie Car',
      });
      expect(CarModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockCar);
    });

    test('Then the delete method should be used', async () => {
      const mockId = '2';
      const exec = jest.fn();
      CarModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec,
      });

      await mockRepo.delete(mockId);
      expect(CarModel.findByIdAndDelete).toHaveBeenCalled();
    });

    test('Then the queryById method should throw an error when the id is not found', async () => {
      const error = new HttpError(404, 'Not found', 'Wrong id for the query');
      const mockId = '6';

      const exec = jest.fn().mockResolvedValueOnce(null);
      CarModel.findById = jest.fn().mockReturnValueOnce({
        exec,
      });

      await expect(mockRepo.queryById(mockId)).rejects.toThrowError(error);
      expect(CarModel.findById).toHaveBeenCalled();
    });

    test('Then the update method should throw an error when the new user equals to null', async () => {
      const error = new HttpError(404, 'Not found', 'Wrong id for the update');
      const mockId = '4';
      const mockCar = {} as Partial<Car>;

      const exec = jest.fn().mockResolvedValueOnce(null);
      CarModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec,
      });

      await expect(mockRepo.update(mockId, mockCar)).rejects.toThrowError(
        error
      );
      expect(CarModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    test('Then the delete method should throw an error when the id is not found', async () => {
      const error = new HttpError(404, 'Not found', 'Wrong id for the delete');
      const mockId = '8';

      const exec = jest.fn().mockResolvedValueOnce(null);
      CarModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec,
      });

      await expect(mockRepo.delete(mockId)).rejects.toThrowError(error);
      expect(CarModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });
});
