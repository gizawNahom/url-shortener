import { Logger } from 'pino';
import { Logger as ILogger } from '../core/ports/logger';

export class PinoLogger implements ILogger {
  constructor(private logger: Logger) {}

  logError(error: Error) {
    this.logger.error(error);
  }

  logInfo(message: string) {
    this.logger.info(message);
  }
}
