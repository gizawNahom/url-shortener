import { Db, MongoClient } from 'mongodb';
import { Url } from '../../src/core/domain/url';
import { MongoUrlStorage } from '../../src/adapter-persistence-mongo/mongoUrlStorage';
import { UrlId } from '../../src/core/domain/urlId';
import DailyClickCountStat, {
  DailyClickCount,
} from '../../src/core/domain/dailyClickCountStat';
import { Click } from '../../src/core/domain/click';

let db: Db;

const CLICKS_COLLECTION = 'clicks';
const URLS_COLLECTION = 'urls';

const savedValidId = 'googleId2';
const savedUrl = new Url('https://google2.com', savedValidId, 1);
const clickDay = '2021-05-18';
const click = new Click(
  new UrlId(savedValidId),
  new Date(`${clickDay}T04:14:00.000Z`),
  ''
);

function getDB(connection: MongoClient): Db {
  return connection.db(process.env.MONGODB_DATABASE_NAME);
}

async function createConnection(): Promise<MongoClient> {
  return await MongoClient.connect(process.env.MONGODB_URI as string);
}

async function seedClicksData() {
  await createClicksTimeSeriesCollection();
  await seedData();

  async function createClicksTimeSeriesCollection() {
    await db.createCollection(CLICKS_COLLECTION, {
      timeseries: {
        timeField: 'timestamp',
        metaField: 'urlId',
        granularity: 'hours',
      },
    });
  }

  async function seedData() {
    await db.collection(CLICKS_COLLECTION).insertMany([
      {
        urlId: click.getId(),
        timestamp: click.getTimestamp(),
      },
    ]);
  }
}

async function seedUrlsData() {
  const urls = db.collection(URLS_COLLECTION);
  await urls.insertMany([
    {
      longUrl: savedUrl.getLongUrl(),
      shortenedId: savedUrl.getShortenedId(),
    },
  ]);
}

function createStorage() {
  return new MongoUrlStorage(db);
}

describe('MongoDB integration', () => {
  let connection: MongoClient;

  beforeAll(async () => {
    connection = await createConnection();
    db = getDB(connection);
    await seedClicksData();
    await seedUrlsData();
  });

  afterAll(async () => {
    await db.dropDatabase();
    await connection.close();
  });

  test('saves url', async () => {
    const storage = createStorage();

    const url = new Url('https://google.com', 'googleId1', 0);
    await storage.save(url);

    expect(await storage.findByLongUrl(url.getLongUrl())).toEqual(url);
  });

  describe('findByLongUrl', () => {
    test('returns url for saved url', async () => {
      const storage = createStorage();

      expect(await storage.findByLongUrl(savedUrl.getLongUrl())).toEqual(
        savedUrl
      );
    });

    test('returns null for unsaved url', async () => {
      const storage = createStorage();

      expect(await storage.findByLongUrl('https://unsaved.com')).toEqual(null);
    });
  });

  describe('findById', () => {
    test('returns url for saved url', async () => {
      const storage = createStorage();

      expect(await storage.findById(savedValidId)).toEqual(savedUrl);
    });

    test('returns null for unsaved url', async () => {
      const storage = createStorage();

      expect(await storage.findById('googleId3')).toEqual(null);
    });
  });

  test('gets total clicks by day', async () => {
    const storage = createStorage();

    expect(await storage.getTotalClicksByDay(new UrlId(savedValidId))).toEqual(
      new DailyClickCountStat(1, [new DailyClickCount(clickDay, 1)])
    );
  });

  test('saves click', async () => {
    const day = '2020-02-10';
    const storage = createStorage();

    await storage.saveClick(
      new Click(new UrlId(savedValidId), new Date(`${day}T02:42:15.000Z`), '')
    );
    await storage.saveClick(
      new Click(new UrlId(savedValidId), new Date(`${day}T02:42:16.000Z`), '')
    );
    await storage.saveClick(
      new Click(new UrlId(savedValidId), new Date(`${day}T05:01:16.000Z`), '')
    );

    expect(await storage.getTotalClicksByDay(new UrlId(savedValidId))).toEqual(
      new DailyClickCountStat(4, [
        new DailyClickCount(day, 3),
        new DailyClickCount(clickDay, 1),
      ])
    );
    const url = new Url(savedUrl.getLongUrl(), savedUrl.getShortenedId(), 4);
    expect(await storage.findById(url.getShortenedId())).toEqual(url);
    expect(await storage.findByLongUrl(url.getLongUrl())).toEqual(url);
  });
});
