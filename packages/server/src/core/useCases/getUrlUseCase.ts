import { Url } from '../domain/url';
import { UrlId } from '../domain/urlId';
import { Logger } from '../ports/logger';
import { UrlStorage } from '../ports/urlStorage';
import { ValidationError } from '../validationError';
import { ValidationMessages } from '../validationMessages';

export class GetUrlUseCase {
  constructor(private urlStorage: UrlStorage, private logger: Logger) {}
  async getUrl(id: string) {
    const uId = this.buildUrlId(id);
    const url = await this.findUrl(uId);
    if (url) {
      this.logFound(id, url);
      return url;
    } else this.throwValidationError();
  }

  private buildUrlId(id: string) {
    return new UrlId(id);
  }

  private findUrl(uId: UrlId) {
    return this.urlStorage.findById(uId.getId());
  }

  private logFound(id: string, url: Url) {
    this.logger.logInfo(`Found url using id(${id})`, url);
  }

  private throwValidationError() {
    throw new ValidationError(ValidationMessages.ID_DOES_NOT_EXIST);
  }
}
