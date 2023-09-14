import { Logger } from '../../src/core/ports/logger';

export class LoggerSpy implements Logger {
  logErrorWasCalledWith: Error;
  logInfoCalls: unknown[][] = [];
  logError(error: Error) {
    this.logErrorWasCalledWith = error;
  }

  logInfo(message: string, obj?: object) {
    this.logInfoCalls.push([message, obj]);
  }
}
