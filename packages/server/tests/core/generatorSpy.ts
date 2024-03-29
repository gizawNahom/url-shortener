import { UrlIdGenerator } from '../../src/core/ports/urlIdGenerator';
import { UrlId } from '../../src/core/domain/urlId';

export class GeneratorSpy implements UrlIdGenerator {
  wasCalled = false;
  generatedId = 'fe3456789';

  async generateUrlId(): Promise<UrlId> {
    this.wasCalled = true;
    return new UrlId(this.generatedId);
  }
}
