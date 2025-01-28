const config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        useESM: true,
        diagnostics: {
          warnOnly: true,
        },
      },
    ],
  },
  testRegex: '((\\.|/)(spec))\\.(ts?)$',
  moduleFileExtensions: ['ts', 'js'],
  extensionsToTreatAsEsm: ['.ts'],
  modulePaths: ['src'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testPathIgnorePatterns: ['/node_modules/'],
  testEnvironment: 'node',
  preset: 'ts-jest',
};

module.exports = config;
