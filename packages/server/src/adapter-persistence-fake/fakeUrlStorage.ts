import { Click } from '../core/domain/click';
import DailyClickCountStat, {
  DailyClickCount,
} from '../core/domain/dailyClickCountStat';
import { DeviceTypePercentage } from '../core/domain/deviceTypePercentage';
import { Url } from '../core/domain/url';
import { UrlId } from '../core/domain/urlId';
import { UrlStorage } from '../core/ports/urlStorage';

export class FakeUrlStorage implements UrlStorage {
  private urls: Array<Url> = [];
  private clicks: Map<string, Array<Click>> = new Map();

  async saveClick(click: Click): Promise<void> {
    const cId = click.getId();
    if (this.clicks.has(cId)) this.clicks.get(cId).push(click);
    else this.clicks.set(cId, [click]);
  }

  async getTopDeviceTypes(id: UrlId): Promise<DeviceTypePercentage[]> {
    const uId = id.getId();
    if (isNotSaved(this.clicks)) return [];
    return aggregateTopDevices(this.clicks);

    function isNotSaved(clicks: Map<string, Array<Click>>) {
      return !clicks.has(uId);
    }

    function aggregateTopDevices(clicks: Map<string, Array<Click>>) {
      const deviceWithCount = new Map<string, number>();
      const urlClicks = clicks.get(uId);
      urlClicks.forEach((e) => {
        const dType = e.getDeviceType();
        if (deviceWithCount.has(dType)) {
          deviceWithCount.set(dType, deviceWithCount.get(dType) + 1);
        } else {
          deviceWithCount.set(dType, 1);
        }
      });
      return [...deviceWithCount.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map((e) => new DeviceTypePercentage(e[0], e[1] / urlClicks.length));
    }
  }

  async getTotalClicksByDay(id: UrlId): Promise<DailyClickCountStat> {
    if (this.isSaved(id)) {
      const byDay = this.groupClicksByDay(id);
      const { totalClicks, dailyClickCounts } = this.calculateStat(byDay);
      return new DailyClickCountStat(totalClicks, dailyClickCounts);
    }
    return new DailyClickCountStat(0, []);
  }

  private isSaved(id: UrlId) {
    return this.clicks.has(id.getId());
  }

  private groupClicksByDay(id: UrlId) {
    const byDay = new Map<string, Array<Click>>();
    this.clicks.get(id.getId()).forEach((c) => {
      const key = this.generateDateKey(c);
      if (!byDay.has(key)) byDay.set(key, []);
      byDay.get(key).push(c);
    });
    return byDay;
  }

  private generateDateKey(c: Click) {
    const d = c.getTimestamp();
    return d.toISOString();
  }

  private calculateStat(byDay: Map<string, Click[]>) {
    let totalClicks = 0;
    const dailyClickCounts = [];
    byDay.forEach((v, k) => {
      totalClicks += v.length;
      dailyClickCounts.push(new DailyClickCount(k, v.length));
    });
    return { totalClicks, dailyClickCounts };
  }

  async save(shortenedUrl: Url): Promise<void> {
    this.urls.push(shortenedUrl);
  }

  async findByLongUrl(longUrl: string): Promise<Url> {
    return this.findLongUrl(longUrl);
  }

  private findLongUrl(longUrl: string) {
    return this.urls.find((e) => e.getLongUrl() === longUrl) || null;
  }

  async findById(id: string): Promise<Url> {
    return this.findId(id);
  }

  private findId(id: string): Url {
    return this.urls.find((e) => e.getShortenedId() === id) || null;
  }
}
