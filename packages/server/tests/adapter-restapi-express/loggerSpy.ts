import { Logger } from '../../src/core/ports/logger';

export class LoggerSpy implements Logger {
  static wasCalled: boolean;
  static wasCalledWith: Error;
  logError(error: Error) {
    LoggerSpy.wasCalled = true;
    LoggerSpy.wasCalledWith = error;
  }
}
