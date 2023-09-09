import { ValidationMessages } from '../../src/core/validationMessages';
import {
  assertBadRequestWithMessage,
  assertBody,
  assertStatusCode,
  buildShortUrl,
  saveUrl,
  sendGetRequest,
  testBadIds,
  testUnknownException,
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

testBadIds(sendRequest);

testUnknownException(() => sendRequest(validId));

test('responds 400 for empty id', async () => {
  const response = await sendRequest('');

  assertBadRequestWithMessage(response, ValidationMessages.ID_REQUIRED);
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
