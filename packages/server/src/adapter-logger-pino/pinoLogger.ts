import { Logger } from 'pino';
import { Logger as ILogger } from '../core/ports/logger';

export class PinoLogger implements ILogger {
  constructor(private logger: Logger) {}

  logError(error: Error) {
    this.logger.error(error);
  }

  logInfo(message: string, obj?: object) {
    if (obj) this.logger.info(obj, message);
    else this.logger.info(message);
  }
}
