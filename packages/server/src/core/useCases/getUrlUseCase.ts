import { Url } from '../domain/url';
import { UrlId } from '../domain/urlId';
import { UrlStorage } from '../ports/urlStorage';
import { ValidationError } from '../validationError';
import { ValidationMessages } from '../validationMessages';

export class GetUrlUseCase {
  constructor(private urlStorage: UrlStorage) {}
  async getUrl(id: string) {
    const uId = this.buildUrlId(id);
    const url = await this.findUrl(uId);
    if (this.isNotFound(url)) this.throwValidationError();
    return url;
  }

  private buildUrlId(id: string) {
    return new UrlId(id);
  }

  private findUrl(uId: UrlId) {
    return this.urlStorage.findById(uId.getId());
  }

  private isNotFound(url: Url) {
    return !url;
  }

  private throwValidationError() {
    throw new ValidationError(ValidationMessages.ID_DOES_NOT_EXIST);
  }
}
