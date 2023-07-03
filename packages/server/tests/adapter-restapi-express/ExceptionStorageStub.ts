import DailyClickCountStat from '../../src/core/domain/dailyClickCountStat';
import { Url } from '../../src/core/domain/url';
import { UrlStorage } from '../../src/core/urlStorage';

export class ExceptionStorageStub implements UrlStorage {
  saveClick(): Promise<void> {
    throw new Error();
  }
  getTotalClicksByDay(): Promise<DailyClickCountStat> {
    throw new Error();
  }
  async findById(): Promise<Url | null> {
    throw new Error();
  }

  async findByLongUrl(): Promise<Url | null> {
    throw new Error();
  }

  async save() {
    throw new Error();
  }
}
