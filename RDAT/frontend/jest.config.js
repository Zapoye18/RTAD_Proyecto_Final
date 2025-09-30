module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    '*.js',
    '!jest.config.js'
  ],
  coverageThreshold: { 
    global: { lines: 80, functions: 80, statements: 80, branches: 70 }
  }
};