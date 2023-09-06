import DailyClickCountStat from '../../src/core/domain/dailyClickCountStat';
import { DeviceTypePercentage } from '../../src/core/domain/deviceTypePercentage';
import { Url } from '../../src/core/domain/url';
import { UrlStorage } from '../../src/core/ports/urlStorage';

export class ExceptionStorageStub implements UrlStorage {
  static stubError: Error = new Error('Stub Error');
  getTop3DeviceTypes(): Promise<DeviceTypePercentage[]> {
    throw ExceptionStorageStub.stubError;
  }
  saveClick(): Promise<void> {
    throw ExceptionStorageStub.stubError;
  }
  getTotalClicksByDay(): Promise<DailyClickCountStat> {
    throw ExceptionStorageStub.stubError;
  }
  async findById(): Promise<Url | null> {
    throw ExceptionStorageStub.stubError;
  }

  async findByLongUrl(): Promise<Url | null> {
    throw ExceptionStorageStub.stubError;
  }

  async save() {
    throw ExceptionStorageStub.stubError;
  }
}
