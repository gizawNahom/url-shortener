import request from 'supertest';
import app from '../../src/adapter-restapi-express/app';
import { ValidationMessages } from '../../src/core/validationMessages';
import Context from '../../src/adapter-restapi-express/context';
import { GeneratorSpy } from '../core/generatorSpy';
import { Url } from '../../src/core/domain/url';
import { UrlStorage } from '../../src/core/ports/urlStorage';
import {
  Messages,
  assertBadRequestWithMessage,
  assertBody,
  assertStatusCode,
  buildShortUrl,
  setExceptionStorageStub,
  url,
} from './utilities';
import DailyClickCountStat from '../../src/core/domain/dailyClickCountStat';
import { DeviceTypePercentage } from '../../src/core/domain/deviceTypePercentage';
import { Click1 } from '../../src/core/domain/click';

const longUrl = url.getLongUrl();

function stubUrlIdGenerator(gSpy: GeneratorSpy) {
  Context.urlIdGenerator = gSpy;
}

async function sendRequest(body) {
  return await request(app).post('/api/urls').send(body);
}

describe('POST /api/urls', () => {
  test('returns 400 with proper message for invalid url', async () => {
    const response = await sendRequest({ url: 'invalid url' });

    assertBadRequestWithMessage(response, ValidationMessages.URL_INVALID);
  });

  test('responds 400 with proper message for empty url', async () => {
    const response = await sendRequest({ url: '' });

    assertBadRequestWithMessage(response, ValidationMessages.URL_REQUIRED);
  });

  test('responds 400 with proper message for undefined url', async () => {
    const response = await sendRequest({});

    assertBadRequestWithMessage(response, ValidationMessages.URL_REQUIRED);
  });

  test('responds 201 with proper body for a valid long url', async () => {
    const gSpy = new GeneratorSpy();
    stubUrlIdGenerator(gSpy);

    const response = await sendRequest({ url: longUrl });

    assertStatusCode(response, 201);
    assertBody(response, {
      longUrl,
      shortUrl: buildShortUrl(gSpy.generatedId),
    });
  });

  test('responds 500 for unknown exception', async () => {
    setExceptionStorageStub();

    const response = await sendRequest({ url: longUrl });

    assertStatusCode(response, 500);
    assertBody(response, {
      message: Messages.SERVER_ERROR,
    });
  });

  test('responds 200 for a preexisting url', async () => {
    const stub = new PreexistingStorageStub();
    const preexistingUrl = stub.preexistingUrl;
    Context.urlStorage = stub;

    const response = await sendRequest({ url: preexistingUrl.getLongUrl() });

    assertStatusCode(response, 200);
    assertBody(response, {
      longUrl: preexistingUrl.getLongUrl(),
      shortUrl: buildShortUrl(preexistingUrl.getShortenedId()),
    });
  });

  test('responds 400 if url is not string', async () => {
    const response = await sendRequest({ url: 1234 });

    assertBadRequestWithMessage(response, ValidationMessages.URL_INVALID);
  });
});

class PreexistingStorageStub implements UrlStorage {
  preexistingUrl = url;

  saveClick1(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getTopDeviceTypes(): Promise<DeviceTypePercentage[]> {
    throw new Error('Method not implemented.');
  }

  saveClick(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getTotalClicksByDay(): Promise<DailyClickCountStat> {
    throw new Error('Method not implemented.');
  }

  findById(): Promise<Url | null> {
    throw new Error('Method not implemented.');
  }

  async findByLongUrl() {
    return this.preexistingUrl;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async save() {}
}
