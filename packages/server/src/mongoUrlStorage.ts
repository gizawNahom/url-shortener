import { Db } from 'mongodb';
import { Click } from './core/domain/click';
import DailyClickCountStat, {
  DailyClickCount,
} from './core/domain/dailyClickCountStat';
import { Url } from './core/domain/url';
import { UrlId } from './core/domain/urlId';
import { UrlStorage } from './core/ports/urlStorage';

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
    if (doc) return this.buildUrl(doc);
    return null;
  }

  private async queryByLongUrl(longUrl: string) {
    return await this.db.collection(this.URLS_COLLECTION).findOne({ longUrl });
  }

  async findById(id: string): Promise<Url> {
    const doc = await this.queryById(id);
    if (doc) return this.buildUrl(doc);
    return null;
  }

  private async queryById(id: string) {
    return await this.db
      .collection(this.URLS_COLLECTION)
      .findOne({ shortenedId: id });
  }

  private buildUrl(doc): Url {
    return new Url(doc.longUrl, doc.shortenedId, doc.totalClicks);
  }

  async getTotalClicksByDay(id: UrlId): Promise<DailyClickCountStat> {
    const totalClicks = await this.countRegisteredClicks(id);
    const totalClicksByDay = await this.aggregateClicksByDay(id);
    return this.buildDailyClickCountStat(totalClicks, totalClicksByDay);
  }

  private countRegisteredClicks(id: UrlId) {
    return this.db
      .collection(this.CLICKS_COLLECTION)
      .countDocuments({ urlId: id.getId() });
  }

  private async aggregateClicksByDay(id: UrlId) {
    return await this.db
      .collection(this.CLICKS_COLLECTION)
      .aggregate([
        filterClicksByUrlId(),
        groupClicksByDayAndCountThem(),
        projectFields(),
        sortChronologically(),
      ])
      .toArray();

    function filterClicksByUrlId() {
      return {
        $match: {
          urlId: id.getId(),
        },
      };
    }

    function groupClicksByDayAndCountThem() {
      return {
        $group: {
          _id: {
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
