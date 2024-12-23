import { Db, MongoClient } from 'mongodb';
import { Url } from '../../src/core/domain/url';
import { MongoUrlStorage } from '../../src/adapter-persistence-mongo/mongoUrlStorage';
import { UrlId } from '../../src/core/domain/urlId';
import DailyClickCountStat, {
  DailyClickCount,
} from '../../src/core/domain/dailyClickCountStat';
import { Click } from '../../src/core/domain/click';
import { saveClick } from '../utilities';
import Context from '../../src/adapter-restapi-express/context';
import { DeviceTypePercentage } from '../../src/core/domain/deviceTypePercentage';

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
const tabletDeviceType = 'tablet';

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
        deviceType: tabletDeviceType,
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
  Context.urlStorage = new MongoUrlStorage(db);
  return Context.urlStorage;
}

async function saveClickTimes(n: number, deviceType: string) {
  for (let i = 0; i < n; i++) {
    await saveClick({ id: savedValidId, deviceType });
  }
}

describe('MongoDB integration', () => {
  let connection: MongoClient;

  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(async () => {
    db = getDB(connection);
    await seedClicksData();
    await seedUrlsData();
  });

  afterEach(async () => {
    await db.dropDatabase();
  });

  afterAll(async () => {
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

  test('gets total clicks by day if a single click is saved', async () => {
    const storage = createStorage();

    expect(await storage.getTotalClicksByDay(new UrlId(savedValidId))).toEqual(
      new DailyClickCountStat(1, [new DailyClickCount(clickDay, 1)])
    );
  });

  test('gets total clicks by day if another url click is saved', async () => {
    const storage = createStorage();
    const day = '2020-02-10';

    await saveClick({
      id: 'googleId3',
      clickDate: new Date(`${day}T02:42:15.000Z`),
    });


    expect(await storage.getTotalClicksByDay(new UrlId(savedValidId))).toEqual(
      new DailyClickCountStat(1, [new DailyClickCount(clickDay, 1)])
    );
  });

  test('gets total clicks by day if multiple clicks are saved', async () => {
    const id = savedValidId;
    const day = '2020-02-10';
    const storage = createStorage();

    await saveClick({
      id,
      clickDate: new Date(`${day}T02:42:15.000Z`),
    });
    await saveClick({
      id,
      clickDate: new Date(`${day}T02:42:16.000Z`),
    });
    await saveClick({
      id,
      clickDate: new Date(`${day}T05:01:16.000Z`),
    });

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

  test('gets top devices for a single type of device', async () => {
    const storage = createStorage();
    await saveClickTimes(3, tabletDeviceType);

    const response = await storage.getTop3DeviceTypes(new UrlId(savedValidId));

    expect(response).toEqual([new DeviceTypePercentage(tabletDeviceType, 1)]);
  });

  test('gets top 3 devices sorted by percentage', async () => {
    const mobileDeviceType = 'mobile';
    const desktopDeviceType = 'desktop';
    const storage = createStorage();
    await saveClickTimes(3, tabletDeviceType);
    await saveClickTimes(3, mobileDeviceType);
    await saveClickTimes(2, desktopDeviceType);
    await saveClickTimes(1, 'tv');

    const response = await storage.getTop3DeviceTypes(new UrlId(savedValidId));

    expect(response).toEqual([
      new DeviceTypePercentage(tabletDeviceType, 4 / 10),
      new DeviceTypePercentage(mobileDeviceType, 3 / 10),
      new DeviceTypePercentage(desktopDeviceType, 2 / 10),
    ]);
  });
});

