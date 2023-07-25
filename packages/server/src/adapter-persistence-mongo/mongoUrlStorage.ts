import { Db } from 'mongodb';
import { Click } from '../core/domain/click';
import DailyClickCountStat, {
  DailyClickCount,
} from '../core/domain/dailyClickCountStat';
import { Url } from '../core/domain/url';
import { UrlId } from '../core/domain/urlId';
import { UrlStorage } from '../core/ports/urlStorage';

export class MongoUrlStorage implements UrlStorage {
  private readonly URLS_COLLECTION = 'urls';
  private readonly CLICKS_COLLECTION = 'clicks';

  constructor(private db: Db) {}

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
    return await this.db.collection(this.URLS_COLLECTION).findOne({ longUrl });
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
    return await this.db
      .collection(this.CLICKS_COLLECTION)
      .aggregate([
        sumTotalClicksByDay(),
        projectFields(),
        sortChronologically(),
      ])
      .toArray();

    function sumTotalClicksByDay() {
      return {
        $group: {
          _id: {
            urlId: id.getId(),
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' },
          },
          totalClicks: { $sum: 1 },
        },
      };
    }

    function projectFields() {
      return {
        $project: {
          _id: 0,
          day: buildISODayString(),
          totalClicks: 1,
        },
      };

      function buildISODayString() {
        return {
          $dateToString: {
            format: '%Y-%m-%d',
            date: {
              $dateFromParts: {
                year: '$_id.year',
                month: '$_id.month',
                day: '$_id.day',
              },
            },
          },
        };
      }
    }

    function sortChronologically() {
      return {
        $sort: {
          day: 1,
        },
      };
    }
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
    });
  }
}
