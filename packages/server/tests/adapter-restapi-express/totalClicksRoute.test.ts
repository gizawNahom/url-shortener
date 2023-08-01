import {
  assert500WithGenericMessage,
  assertBadRequestWithMessage,
  assertBody,
  assertStatusCode,
  describeInvalidId,
  saveUrl,
  sendGetRequest,
  setExceptionStorageStub,
  validId,
} from './utilities';
import { ValidationMessages } from '../../src/core/validationMessages';
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
    test(`returns 400 for id: ${id}`, async () => {
      const response = await sendRequest(id as string);

      assertBadRequestWithMessage(response, errorMessage);
    });
  });

  test('returns 500 for unknown exception', async () => {
    setExceptionStorageStub();

    const response = await sendRequest(validId);

    assert500WithGenericMessage(response);
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

  test('returns 400 for an unsaved valid id', async () => {
    const response = await sendRequest(validId);

    assertBadRequestWithMessage(response, ValidationMessages.ID_DOES_NOT_EXIST);
  });
});
