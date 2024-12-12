import { Db } from 'mongodb';
import { Click } from '../core/domain/click';
import DailyClickCountStat, {
  DailyClickCount,
} from '../core/domain/dailyClickCountStat';
import { Url } from '../core/domain/url';
import { UrlId } from '../core/domain/urlId';
import { UrlStorage } from '../core/ports/urlStorage';
import { DeviceTypePercentage } from '../core/domain/deviceTypePercentage';

export class MongoUrlStorage implements UrlStorage {
  private readonly URLS_COLLECTION = 'urls';
  private readonly CLICKS_COLLECTION = 'clicks';

  constructor(private db: Db) {}

  async getTop3DeviceTypes(id: UrlId): Promise<DeviceTypePercentage[]> {
    return this.mapToDeviceTypePercentage(await this.queryTopDeviceTypes(id));
  }

  private async queryTopDeviceTypes(id: UrlId) {
    return await this.db
      .collection(this.CLICKS_COLLECTION)
      .aggregate([
        {
          $group: {
            _id: {
              urlId: id.getId(),
              deviceType: '$deviceType',
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$count' },
            devices: {
              $push: { deviceType: '$_id.deviceType', count: '$count' },
            },
          },
        },
        {
          $unwind: '$devices',
        },
        {
          $project: {
            _id: 0,
            type: '$devices.deviceType',
            percentage: {
              $divide: ['$devices.count', '$total'],
            },
          },
        },
        {
          $sort: { percentage: -1 },
        },
        {
          $limit: 3,
        },
      ])
      .toArray();
  }

  private mapToDeviceTypePercentage(topDeviceTypes): DeviceTypePercentage[] {
    return topDeviceTypes.map(
      (e) => new DeviceTypePercentage(e.type, e.percentage)
    );
  }

  async save(shortenedUrl: Url): Promise<void> {
    await this.db.collection(this.URLS_COLLECTION).insertOne({
      longUrl: shortenedUrl.getLongUrl(),
      shortenedId: shortenedUrl.getShortenedId(),
      totalClicks: shortenedUrl.getTotalClicks(),
    });
  }

  async findByLongUrl(longUrl: string): Promise<Url> {
    const doc = await this.queryByLongUrl(longUrl);
    if (doc) {
      const totalClicks = await this.countRegisteredClicks(doc.shortenedId);
      return this.buildUrl(doc, totalClicks);
    }
    return null;
  }

  private async queryByLongUrl(longUrl: string) {
    return await this.db
      .collection(this.URLS_COLLECTION)
      .findOne({ longUrl: { $eq: longUrl } });
  }

  async findById(id: string): Promise<Url> {
    const doc = await this.queryById(id);
    if (doc) {
      const totalClicks = await this.countRegisteredClicks(doc.shortenedId);
      return this.buildUrl(doc, totalClicks);
    }
    return null;
  }

  private async queryById(id: string) {
    return await this.db
      .collection(this.URLS_COLLECTION)
      .findOne({ shortenedId: id });
  }

  private buildUrl(doc, totalClicks: number): Url | PromiseLike<Url> {
    return new Url(doc.longUrl, doc.shortenedId, totalClicks);
  }

  async getTotalClicksByDay(id: UrlId): Promise<DailyClickCountStat> {
    const totalClicks = await this.countRegisteredClicks(id.getId());
    const totalClicksByDay = await this.aggregateClicksByDay(id);
    return this.buildDailyClickCountStat(totalClicks, totalClicksByDay);
  }

  private countRegisteredClicks(id: string) {
    return this.db
      .collection(this.CLICKS_COLLECTION)
      .countDocuments({ urlId: id });
  }

  private async aggregateClicksByDay(id: UrlId) {
    return await this.db.collection(this.CLICKS_COLLECTION).aggregate([
      {
        $match: {
          urlId: id.getId(),
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          totalClicks: { $sum: 1 },
        },
      },
      {
        $project: {
          day: '$_id',
          totalClicks: 1,
          _id: 0,
        },
      },
      {
        $sort: { day: 1 },
      },
    ]).toArray();
  }

  private buildDailyClickCountStat(
    totalClicks: number,
    totalClicksByDay
  ): DailyClickCountStat | PromiseLike<DailyClickCountStat> {
    return new DailyClickCountStat(
      totalClicks,
      totalClicksByDay as Array<DailyClickCount>
    );
  }

  async saveClick(click: Click): Promise<void> {
    await this.db.collection(this.CLICKS_COLLECTION).insertOne({
      urlId: click.getId(),
      timestamp: click.getTimestamp(),
      deviceType: click.getDeviceType(),
    });
  }
}
