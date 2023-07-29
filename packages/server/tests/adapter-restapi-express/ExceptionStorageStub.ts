import { Click1 } from '../../src/core/domain/click';
import DailyClickCountStat from '../../src/core/domain/dailyClickCountStat';
import { DeviceTypePercentage } from '../../src/core/domain/deviceTypePercentage';
import { Url } from '../../src/core/domain/url';
import { UrlStorage } from '../../src/core/ports/urlStorage';

export class ExceptionStorageStub implements UrlStorage {
  saveClick1(click: Click1): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getTopDeviceTypes(): Promise<DeviceTypePercentage[]> {
    throw new Error('Method not implemented.');
  }
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
