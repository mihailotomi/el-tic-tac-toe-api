module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
    },
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',
      },
    },
    moduleDirectories: ['node_modules', 'src'],
    coverageDirectory: './coverage',
    collectCoverageFrom: ['src/**/*.(t|j)s'],
  };
  