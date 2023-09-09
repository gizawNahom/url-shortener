import {
  assert500WithGenericMessage,
  assertBody,
  assertStatusCode,
  assertStorageStubErrorWasLogged,
  saveUrl,
  sendGetRequest,
  setExceptionStorageStub,
  setLoggerSpy,
  testBadIds,
  validId,
} from './utilities';
import Context from '../../src/adapter-restapi-express/context';
import { FakeUrlStorage } from '../../src/adapter-persistence-fake/fakeUrlStorage';
import { saveClick } from '../utilities';
import { Response } from 'supertest';

async function sendRequest(id: string): Promise<Response> {
  return await sendGetRequest('/api/urls/' + id + '/total-clicks-by-day');
}

describe('GET api/urls/<id>/total-clicks-by-day', () => {
  beforeEach(() => {
    Context.urlStorage = new FakeUrlStorage();
  });

  testBadIds(sendRequest);

  test('logs and returns 500 for unknown exception', async () => {
    setExceptionStorageStub();
    setLoggerSpy();

    const response = await sendRequest(validId);

    assert500WithGenericMessage(response);
    assertStorageStubErrorWasLogged();
  });

  test('returns 200 for a saved valid id', async () => {
    const clickDate = new Date();
    await saveUrl();
    await saveClick({ id: validId, clickDate });

    const response = await sendRequest(validId);

    assertStatusCode(response, 200);
    assertBody(response, {
      totalClicks: 1,
      dailyClickCounts: [
        {
          day: clickDate.toISOString(),
          totalClicks: 1,
        },
      ],
    });
  });
});
