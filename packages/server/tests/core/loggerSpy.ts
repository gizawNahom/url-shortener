import { Logger } from '../../src/core/ports/logger';

export class LoggerSpy implements Logger {
  logErrorWasCalledWith: Error;
  logInfoWasCalledWith: string;
  logError(error: Error) {
    this.logErrorWasCalledWith = error;
  }

  logInfo(message: string) {
    this.logInfoWasCalledWith = message;
  }
}
