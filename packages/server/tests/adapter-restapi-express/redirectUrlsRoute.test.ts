import { ValidationMessages } from '../../src/core/validationMessages';
import {
  assertBadRequestWithMessage,
  assertStatusCode,
  saveUrl,
  sendGetRequest,
  testBadIds,
  testUnknownException,
  url,
  validId,
} from './utilities';
import Context from '../../src/adapter-restapi-express/context';
import { FakeUrlStorage } from '../../src/adapter-persistence-fake/fakeUrlStorage';
import { assertSavedDeviceType } from '../utilities';

function sendRequest(id: string) {
  return sendGetRequest('/' + id);
}

describe('GET /<id>', () => {
  test('responds 400 for empty id', async () => {
    const response = await sendRequest('');

    assertBadRequestWithMessage(response, ValidationMessages.ID_REQUIRED);
  });

  testBadIds(sendRequest);

  testUnknownException(() => sendRequest(validId));

  test('responds with a 302 redirect if id exists', async () => {
    const deviceType = 'tablet';
    await saveUrl();

    const tabletUserAgent =
      'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1';
    const response = await sendRequest(url.getShortenedId()).set(
      'User-Agent',
      tabletUserAgent
    );

    assertStatusCode(response, 302);
    expect(response.headers.location).toBe(url.getLongUrl());
    await assertSavedDeviceType(
      Context.urlStorage,
      url.getShortenedId(),
      deviceType
    );
  });

  afterEach(() => {
    Context.urlStorage = new FakeUrlStorage();
  });
});
