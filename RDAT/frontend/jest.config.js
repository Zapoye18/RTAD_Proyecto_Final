module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    '*.js',
    '!jest.config.js'
  ],
  coverageThreshold: { 
    global: { 
      lines: 50, 
      functions: 40, 
      statements: 50, 
      branches: 30 
    } 
  }
};