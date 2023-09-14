import { UrlId } from '../domain/urlId';
import { Logger } from '../ports/logger';
import { UrlStorage } from '../ports/urlStorage';
import { ValidationError } from '../validationError';
import { ValidationMessages } from '../validationMessages';
import { findUrlById } from './domainServices';

export class GetUrlUseCase {
  constructor(private urlStorage: UrlStorage, private logger: Logger) {}
  async getUrl(id: string) {
    const url = await findUrlById(
      this.buildUrlId(id),
      this.urlStorage,
      this.logger
    );
    if (url) return url;
    else this.throwValidationError();
  }

  private buildUrlId(id: string) {
    return new UrlId(id);
  }

  private throwValidationError() {
    throw new ValidationError(ValidationMessages.ID_DOES_NOT_EXIST);
  }
}
