import { Url } from '../domain/url';
import { UrlIdGenerator } from '../ports/urlIdGenerator';
import { UrlStorage } from '../ports/urlStorage';
import validUrl from 'valid-url';
import { ValidationError } from '../validationError';
import { ValidationMessages } from '../validationMessages';
import { Logger } from '../ports/logger';

export class ShortenUseCase {
  constructor(
    private storage: UrlStorage,
    private generator: UrlIdGenerator,
    private logger: Logger
  ) {}

  async execute(longUrl: string): Promise<ShortenUseCaseResponse> {
    this.validateLongUrl(longUrl);
    const preUrl = await this.findPreexistingUrl(longUrl);
    if (preUrl) {
      this.logFound(longUrl, preUrl);
      return this.buildResponseForPreexisting(preUrl);
    } else {
      this.logNotFound(longUrl);
      const nU = await this.createNewUrl(longUrl);
      this.logCreated(nU);
      return this.buildResponse(nU);
    }
  }

  private validateLongUrl(longUrl: string) {
    if (isFalsy(longUrl)) throwRequiredError();
    else if (!isWebUri(longUrl)) throwInvalidError();

    function isFalsy(longUrl: string) {
      return !longUrl;
    }

    function throwRequiredError() {
      throw buildValidationError(ValidationMessages.URL_REQUIRED);
    }

    function isWebUri(longUrl) {
      return validUrl.isWebUri(longUrl);
    }

    function throwInvalidError() {
      throw buildValidationError(ValidationMessages.URL_INVALID);
    }

    function buildValidationError(message: string): ValidationError {
      return new ValidationError(message);
    }
  }

  private async findPreexistingUrl(longUrl: string) {
    return await this.storage.findByLongUrl(longUrl);
  }

  private logFound(longUrl: string, preUrl: Url) {
    this.logger.logInfo(
      `Found preexisting url using long url(${longUrl})`,
      preUrl
    );
  }

  private buildResponseForPreexisting(preUrl: Url): ShortenUseCaseResponse {
    return { ...this.buildResponse(preUrl), preexisting: true };
  }

  private async createNewUrl(longUrl: string) {
    const shortenedId = await this.generateShortenedId();
    const url = this.buildUrl(longUrl, shortenedId);
    await this.saveUrl(url);
    return url;
  }

  private logCreated(nU: Url) {
    this.logger.logInfo('Created new url', nU);
  }

  private async generateShortenedId() {
    return (await this.generator.generateUrlId()).getId();
  }

  private buildUrl(longUrl: string, shortenedId: string) {
    const url = new Url(longUrl, shortenedId, 0);
    return url;
  }

  private async saveUrl(url: Url) {
    await this.storage.save(url);
  }

  private logNotFound(longUrl: string) {
    this.logger.logInfo(`Didn't find preexisting url(${longUrl})`);
  }

  private buildResponse(url: Url) {
    return {
      longUrl: url.getLongUrl(),
      shortenedId: url.getShortenedId(),
      preexisting: false,
    };
  }
}

export interface ShortenUseCaseResponse {
  longUrl: string;
  shortenedId: string;
  preexisting: boolean;
}
