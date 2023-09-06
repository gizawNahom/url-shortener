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
import { Logger } from '../../src/core/ports/logger';
import { ExceptionStorageStub } from './ExceptionStorageStub';
import { ValidationError } from '../../src/core/validationError';

const longUrl = url.getLongUrl();

function stubUrlIdGenerator(gSpy: GeneratorSpy) {
  Context.urlIdGenerator = gSpy;
}

async function sendRequest(body) {
  return await request(app).post('/api/urls').send(body);
}

function setLoggerSpy() {
  const spy = new LoggerSpy();
  Context.logger = spy;
}

function describeInvalidUrl(
  testInvalidUrl: (urlObject: object, errorMessage: string) => void
) {
  describe.each(getParams())('Invalid url', (urlObject, errorMessage) => {
    testInvalidUrl(urlObject, errorMessage);
  });

  function getParams(): readonly [object, string][] {
    return [
      [{ url: 'invalid url' }, ValidationMessages.URL_INVALID],
      [{ url: '' }, ValidationMessages.URL_REQUIRED],
      [{ url: 1234 }, ValidationMessages.URL_INVALID],
      [{}, ValidationMessages.URL_REQUIRED],
    ];
  }
}

describe('POST /api/urls', () => {
  describeInvalidUrl((urlObject, errorMessage) => {
    test(`logs and responds 400 with "${errorMessage}" message for ${urlObject['url']}`, async () => {
      setLoggerSpy();

      const response = await sendRequest(urlObject);

      assertBadRequestWithMessage(response, errorMessage);
      assertLogErrorWasCalledWith(new ValidationError(errorMessage));
    });
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

  test('logs and responds 500 for unknown exception', async () => {
    setExceptionStorageStub();
    setLoggerSpy();

    const response = await sendRequest({ url: longUrl });

    assertStatusCode(response, 500);
    assertBody(response, {
      message: Messages.SERVER_ERROR,
    });
    assertLogErrorWasCalledWith(ExceptionStorageStub.stubError);
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
});

class LoggerSpy implements Logger {
  static wasCalled: boolean;
  static wasCalledWith: Error;
  logError(error: Error) {
    LoggerSpy.wasCalled = true;
    LoggerSpy.wasCalledWith = error;
  }
}

class PreexistingStorageStub implements UrlStorage {
  preexistingUrl = url;

  getTop3DeviceTypes(): Promise<DeviceTypePercentage[]> {
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
function assertLogErrorWasCalledWith(error: Error) {
  expect(LoggerSpy.wasCalled).toBe(true);
  expect(LoggerSpy.wasCalledWith).toStrictEqual(error);
}
