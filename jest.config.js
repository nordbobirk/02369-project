const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    "**/_test/**/*.[jt]s?(x)",      // <--- YOUR FOLDER
    "**/?(*.)+(test).[jt]s?(x)",   // <--- Normal colocated tests
  ],
}

module.exports = createJestConfig(customJestConfig)