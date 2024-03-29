import path from 'path';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import {
  fetch,
  geTotalClicksByDay,
  getTopDeviceTypes,
  getUrl,
  shortenUrl,
} from '@/utilities/httpClient';
import { invalidId, longUrl, shortUrl, validId } from 'mocks/values';
import {
  getClickCountPath,
  getTopDeviceTypesPath,
  getUrlsBasePath,
  getUrlsPath,
} from 'mocks/utils';

const { string, number } = MatchersV3;

const provider = new PactV3({
  dir: path.resolve(process.cwd(), 'pacts'),
  consumer: 'urlShortener-client',
  provider: 'urlShortener-server',
});

function setBaseUrl(url: string) {
  process.env.NEXT_PUBLIC_API_BASE_URL = url;
}

function executeTest(
  callBack: (mockServer: MatchersV3.V3MockServer) => Promise<void>
) {
  return provider.executeTest(callBack);
}

function assertObjectEquality(obj1: unknown, obj2: unknown) {
  expect(obj1).toStrictEqual(obj2);
}

test('Get api/ returns HTTP 200 with a greeting', () => {
  const path = '/api';
  const greeting = 'hello world';

  provider
    .uponReceiving('a request for a greeting')
    .withRequest({
      method: 'GET',
      path,
      headers: { Accept: '*/*' },
    })
    .willRespondWith({
      status: 200,
      contentType: 'application/json',
      body: { greeting: string(greeting) },
    });

  return executeTest(async (mockServer) => {
    setBaseUrl(mockServer.url);

    const greeting = await fetch(path);

    expect(greeting).toBe(greeting);
  });
});

test('POST /api/urls returns 201 with a shortened url', () => {
  const path = getUrlsBasePath();

  provider
    .uponReceiving('a request to shorten a url')
    .withRequest({
      method: 'POST',
      path,
      headers: { Accept: 'application/json' },
      body: { url: string(longUrl) },
    })
    .willRespondWith({
      status: 201,
      contentType: 'application/json',
      body: {
        longUrl: string(longUrl),
        shortUrl: string(shortUrl),
      },
    });

  return executeTest(async (mockServer) => {
    setBaseUrl(mockServer.url);

    const result = await shortenUrl(longUrl);

    assertObjectEquality(result, {
      longUrl,
      shortUrl,
    });
  });
});

test('GET /api/urls/<id>/total-clicks-by-day', () => {
  const path = getClickCountPath(validId);
  const totalClicks = 1;
  const clickDate = '1/1/1999';

  provider
    .given('a url is saved and clicked once')
    .uponReceiving('a request for total clicks by day')
    .withRequest({
      method: 'GET',
      path,
      headers: { Accept: 'application/json' },
    })
    .willRespondWith({
      status: 200,
      contentType: 'application/json',
      body: {
        totalClicks: number(totalClicks),
        dailyClickCounts: [
          {
            day: string(clickDate),
            totalClicks: number(totalClicks),
          },
        ],
      },
    });

  return executeTest(async (mockServer) => {
    setBaseUrl(mockServer.url);

    const response = await geTotalClicksByDay(validId);

    assertObjectEquality(response, {
      totalClicks: totalClicks,
      dailyClickCounts: [{ day: clickDate, totalClicks: totalClicks }],
    });
  });
});

describe('GET /api/urls/<id>', () => {
  test('returns 200 for a valid id', () => {
    const totalClicks = 1;

    provider
      .given('a url is saved and clicked once')
      .uponReceiving('a request for a url')
      .withRequest({
        method: 'GET',
        path: getUrlsPath(validId),
        headers: { Accept: 'application/json' },
      })
      .willRespondWith({
        status: 200,
        contentType: 'application/json',
        body: {
          longUrl: string(longUrl),
          shortUrl: string(shortUrl),
          totalClicks: number(totalClicks),
        },
      });

    return executeTest(
      async (mockServer: MatchersV3.V3MockServer): Promise<void> => {
        setBaseUrl(mockServer.url);

        const response = await getUrl(validId);

        assertObjectEquality(response, {
          totalClicks,
          longUrl,
          shortUrl,
        });
      }
    );
  });

  test('returns 400 for an invalid id', () => {
    provider
      .uponReceiving('a request for a url with an invalid id')
      .withRequest({
        method: 'GET',
        path: getUrlsPath(invalidId),
        headers: { Accept: 'application/json' },
      })
      .willRespondWith({
        status: 400,
        contentType: 'application/json',
        body: {
          message: string('Id is invalid'),
        },
      });

    return executeTest(
      async (mockServer: MatchersV3.V3MockServer): Promise<void> => {
        setBaseUrl(mockServer.url);

        await expect(async () => {
          await getUrl(invalidId);
        }).rejects.toThrowError();
      }
    );
  });
});

test('GET /api/urls/:id/top-device-types', async () => {
  const path = getTopDeviceTypesPath(validId);
  const deviceType = 'tablet';
  const percentage = 1;

  provider
    .given('a url is saved and clicked once')
    .uponReceiving('a request for the top devices that clicked the url')
    .withRequest({
      method: 'GET',
      path,
      headers: { Accept: 'application/json' },
    })
    .willRespondWith({
      status: 200,
      contentType: 'application/json',
      body: {
        devices: [
          {
            type: string(deviceType),
            percentage: number(percentage),
          },
        ],
      },
    });

  return executeTest(async (mockServer) => {
    setBaseUrl(mockServer.url);

    const response = await getTopDeviceTypes(validId);

    assertObjectEquality(response, [{ type: deviceType, percentage }]);
  });
});
