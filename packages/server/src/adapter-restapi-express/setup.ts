import { Db, MongoClient } from 'mongodb';
import { MongoUrlStorage } from '../adapter-persistence-mongo/mongoUrlStorage';
import Context from './context';

export async function setupMongo() {
  const connection = await createConnection();
  const db = getDB();
  if (await doesClicksCollectionExist(db))
    await createClicksTimeSeriesCollection(db);
  registerStorageInstance();

  async function createConnection() {
    return await MongoClient.connect(process.env.MONGODB_URI as string);
  }

  function getDB() {
    return connection.db(process.env.MONGODB_DATABASE_NAME);
  }

  async function doesClicksCollectionExist(db: Db) {
    const collections = await db.listCollections().toArray();
    return !collections.some((collection) => collection.name === 'clicks');
  }

  async function createClicksTimeSeriesCollection(db: Db) {
    await db.createCollection('clicks', {
      timeseries: {
        timeField: 'timestamp',
        metaField: 'urlId',
        granularity: 'hours',
      },
    });
  }

  function registerStorageInstance() {
    Context.urlStorage = new MongoUrlStorage(db);
  }
}
