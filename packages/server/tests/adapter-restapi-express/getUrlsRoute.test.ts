import { ValidationMessages } from '../../src/core/validationMessages';
import {
  assert500WithGenericMessage,
  assertBadRequestWithMessage,
  assertBody,
  assertStatusCode,
  buildShortUrl,
  saveUrl,
  sendGetRequest,
  setExceptionStorageStub,
  url,
  validId,
} from './utilities';
import Context from '../../src/adapter-restapi-express/context';
import { FakeUrlStorage } from '../../src/adapter-persistence-fake/fakeUrlStorage';

async function sendRequest(id: string) {
  return await sendGetRequest('/api/urls/' + id);
}

afterEach(() => {
  Context.urlStorage = new FakeUrlStorage();
});

describe.each([
  ['', ValidationMessages.ID_REQUIRED],
  ['invalid id', ValidationMessages.ID_INVALID],
  [validId, ValidationMessages.ID_DOES_NOT_EXIST],
])('Invalid id', (id, errorMessage) => {
  test(`responds 400 with message "${errorMessage}" for id "${id}"`, async () => {
    const response = await sendRequest(id);

    assertBadRequestWithMessage(response, errorMessage);
  });
});

test('responds 500 for unknown exception', async () => {
  setExceptionStorageStub();

  const response = await sendRequest(validId);

  assert500WithGenericMessage(response);
});

test('responds 200 for a saved url', async () => {
  await saveUrl();

  const response = await sendRequest(validId);

  assertStatusCode(response, 200);
  assertBody(response, {
    longUrl: url.getLongUrl(),
    shortUrl: buildShortUrl(url.getShortenedId()),
    totalClicks: url.getTotalClicks(),
  });
});
