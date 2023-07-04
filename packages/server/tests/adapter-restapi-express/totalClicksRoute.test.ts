import {
  assert500WithGenericMessage,
  assertBadRequestWithMessage,
  assertBody,
  assertStatusCode,
  saveUrl,
  sendGetRequest,
  setExceptionStorageStub,
  validId,
} from './utilities';
import { ValidationMessages } from '../../src/core/validationMessages';
import Context from '../../src/adapter-restapi-express/context';
import { FakeUrlStorage } from '../../src/adapter-persistence-fake/fakeUrlStorage';
import { Click } from '../../src/core/domain/click';
import { UrlId } from '../../src/core/domain/urlId';

async function sendRequest(id: string) {
  return await sendGetRequest('/api/urls/' + id + '/total-clicks-by-day');
}

describe('GET api/urls/<id>/total-clicks-by-day', () => {
  beforeEach(() => {
    Context.urlStorage = new FakeUrlStorage();
  });

  test.each(['_-3456789', '1234t7'])(
    'returns 400 for invalid id',
    async (invalidId) => {
      const response = await sendRequest(invalidId);

      assertBadRequestWithMessage(response, ValidationMessages.ID_INVALID);
    }
  );

  test('returns 500 for unknown exception', async () => {
    setExceptionStorageStub();

    const response = await sendRequest(validId);

    assert500WithGenericMessage(response);
  });

  test('returns 200 for a saved valid id', async () => {
    const clickDate = new Date();
    await saveUrl();
    Context.urlStorage.saveClick(new Click(new UrlId(validId), clickDate));

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
