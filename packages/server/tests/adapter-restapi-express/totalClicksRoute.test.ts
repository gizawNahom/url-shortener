import {
  assert500WithGenericMessage,
  assertBadRequestWithMessage,
  assertBody,
  assertStatusCode,
  assertStorageStubErrorWasLogged,
  assertValidationErrorWasLoggedWithMessage,
  describeInvalidId,
  saveUrl,
  sendGetRequest,
  setExceptionStorageStub,
  setLoggerSpy,
  validId,
} from './utilities';
import Context from '../../src/adapter-restapi-express/context';
import { FakeUrlStorage } from '../../src/adapter-persistence-fake/fakeUrlStorage';
import { saveClick } from '../utilities';

async function sendRequest(id: string) {
  return await sendGetRequest('/api/urls/' + id + '/total-clicks-by-day');
}

describe('GET api/urls/<id>/total-clicks-by-day', () => {
  beforeEach(() => {
    Context.urlStorage = new FakeUrlStorage();
  });

  describeInvalidId((id, errorMessage) => {
    test(`logs and returns 400 with "${errorMessage}" for id: ${id}`, async () => {
      setLoggerSpy();

      const response = await sendRequest(id as string);

      assertBadRequestWithMessage(response, errorMessage);
      assertValidationErrorWasLoggedWithMessage(errorMessage);
    });
  });

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
