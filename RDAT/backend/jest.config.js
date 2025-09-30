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
    '<rootDir>/models/user.model.js',
    '<rootDir>/models/usuario.model.js'
  ],
  coverageThreshold: { global: { lines: 80, functions: 80, statements: 80, branches: 70 } }
};
