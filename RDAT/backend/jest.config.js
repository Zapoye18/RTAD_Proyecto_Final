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
  coverageThreshold: { global: { lines: 70, functions: 70, statements: 70, branches: 40 } }
};
