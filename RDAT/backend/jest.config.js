module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/models/user.model.js'
  ],
  coverageThreshold: { global: { lines: 45, functions: 40, statements: 45, branches: 25 } }
};
