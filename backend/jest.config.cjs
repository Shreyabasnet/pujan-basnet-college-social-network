module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': ['babel-jest', { rootMode: 'upward' }],
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!src/scripts/**',
  ],
  testTimeout: 10000,
};
