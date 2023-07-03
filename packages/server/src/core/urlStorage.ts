import { Click } from './domain/click';
import DailyClickCountStat from './domain/dailyClickCountStat';
import { Url } from './domain/url';
import { UrlId } from './domain/urlId';

export interface UrlStorage {
  save(shortenedUrl: Url): Promise<void>;
  findByLongUrl(longUrl: string): Promise<Url | null>;
  findById(id: string): Promise<Url | null>;
  getTotalClicksByDay(id: UrlId): Promise<DailyClickCountStat>;
  saveClick(click: Click): Promise<void>;
}
