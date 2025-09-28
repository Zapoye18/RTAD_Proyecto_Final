module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
    'server.js'
  ],
  coverageThreshold: { global: { lines: 80, functions: 80, statements: 80, branches: 70 } }
};
