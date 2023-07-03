import { UrlId } from '../domain/urlId';

export interface UrlIdGenerator {
  generateUrlId(): Promise<UrlId>;
}
