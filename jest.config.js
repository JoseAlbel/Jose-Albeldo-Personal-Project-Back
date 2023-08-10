/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'index.ts',
    'db/db.connect.ts',
    'app.ts',
    'config.ts',
    'routers/user.router.ts',
    'repository/user.mongo.model.ts',
    'entities',
    'controllers/controller.ts',
  ],
};
