import { UrlId } from '../domain/urlId';
import { Url } from '../domain/url';
import { UrlStorage } from '../ports/urlStorage';
import { ValidationError } from '../validationError';
import { ValidationMessages } from '../validationMessages';
import { Click } from '../domain/click';

export class RedirectUseCase {
  constructor(private storage: UrlStorage) {}

  async execute(id: string, deviceType?: string): Promise<string> {
    const uId = this.buildUrlId(id);
    const url = await this.findUrlById(uId);
    if (this.isNotFound(url)) this.throwDoesNotExistError();
    await this.saveClick(uId, deviceType);
    return url.getLongUrl();
  }

  private buildUrlId(id: string) {
    return new UrlId(id);
  }

  private async findUrlById(id: UrlId) {
    return await this.storage.findById(id.getId());
  }

  private isNotFound(url: Url) {
    return !url;
  }

  private throwDoesNotExistError() {
    throw new ValidationError(ValidationMessages.ID_DOES_NOT_EXIST);
  }

  private async saveClick(uId: UrlId, deviceType: string) {
    await this.storage.saveClick(
      new Click(uId, new Date(), deviceType ?? 'desktop')
    );
  }
}
