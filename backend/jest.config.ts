// backend/jest.config.ts
import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }]
  },
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: './backend/tsconfig.json'
    }
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/testes/**/*.test.ts'],
  rootDir: './src'
}

export default config