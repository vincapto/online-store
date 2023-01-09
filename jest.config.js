module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  transformIgnorePatterns: ['src/node_modules/'],
  moduleNameMapper: {
    ".*\\.scss$": "<rootDir>/src/common/dummy.ts"
  }
};
