import { UrlId } from '../domain/urlId';
import { UrlStorage } from '../ports/urlStorage';
import { ValidationError } from '../validationError';
import { ValidationMessages } from '../validationMessages';
import { Click } from '../domain/click';
import { Logger } from '../ports/logger';
import { findUrlById } from './domainServices';

export class RedirectUseCase {
  constructor(private storage: UrlStorage, private logger: Logger) {}

  async execute(id: string, deviceType?: string): Promise<string> {
    const uId = this.buildUrlId(id);
    const url = await findUrlById(uId, this.storage, this.logger);
    if (url) {
      const c = this.buildClick(uId, deviceType);
      await this.saveClick(c);
      this.logClicked(id, c);
      return url.getLongUrl();
    } else this.throwDoesNotExistError();
  }

  private buildUrlId(id: string) {
    return new UrlId(id);
  }

  private buildClick(uId: UrlId, deviceType: string) {
    return new Click(uId, new Date(), deviceType ?? 'desktop');
  }

  private async saveClick(click: Click) {
    await this.storage.saveClick(click);
  }

  private logClicked(id: string, c: Click) {
    this.logger.logInfo(`Saved click using id(${id})`, c);
  }

  private throwDoesNotExistError() {
    throw new ValidationError(ValidationMessages.ID_DOES_NOT_EXIST);
  }
}
