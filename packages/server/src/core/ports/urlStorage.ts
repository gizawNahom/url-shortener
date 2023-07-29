import { Click, Click1 } from '../domain/click';
import DailyClickCountStat from '../domain/dailyClickCountStat';
import { DeviceTypePercentage } from '../domain/deviceTypePercentage';
import { Url } from '../domain/url';
import { UrlId } from '../domain/urlId';

export interface UrlStorage {
  save(shortenedUrl: Url): Promise<void>;
  findByLongUrl(longUrl: string): Promise<Url | null>;
  findById(id: string): Promise<Url | null>;
  getTotalClicksByDay(id: UrlId): Promise<DailyClickCountStat>;
  saveClick(click: Click): Promise<void>;
  saveClick1(click: Click1): Promise<void>;
  getTopDeviceTypes(id: UrlId): Promise<Array<DeviceTypePercentage>>;
}
