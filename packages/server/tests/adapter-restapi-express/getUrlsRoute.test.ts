import { ValidationMessages } from '../../src/core/validationMessages';
import {
  assert500WithGenericMessage,
  assertBadRequestWithMessage,
  assertBody,
  assertStatusCode,
  buildShortUrl,
  describeBadId,
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

describeBadId((id, errorMessage) => {
  test(`returns 400 for id: ${id}`, async () => {
    const response = await sendRequest(id as string);

    assertBadRequestWithMessage(response, errorMessage);
  });
});

test('responds 400 for empty id', async () => {
  const response = await sendRequest('');

  assertBadRequestWithMessage(response, ValidationMessages.ID_REQUIRED);
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
