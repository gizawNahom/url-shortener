/* eslint-disable */
export default {
  displayName: 'server',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/server',
  transformIgnorePatterns: ['node_modules/(?!(nanoid)/)'],
  testPathIgnorePatterns: ['providerContract.test', 'mongoUrlStorage.test.ts'],
};
