import { Logger } from '../../src/core/ports/logger';

export class LoggerSpy implements Logger {
  static logErrorWasCalledWith: Error;
  logError(error: Error) {
    LoggerSpy.logErrorWasCalledWith = error;
  }

  logInfo(message: string) {
    throw new Error('Method not implemented.');
  }
}
