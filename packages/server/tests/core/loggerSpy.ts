import { Logger } from '../../src/core/ports/logger';

export class LoggerSpy implements Logger {
  logErrorWasCalledWith: Error;
  logInfoCalls: string[] = [];
  logError(error: Error) {
    this.logErrorWasCalledWith = error;
  }

  logInfo(message: string) {
    this.logInfoCalls.push(message);
  }
}
