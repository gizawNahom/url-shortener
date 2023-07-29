import { ValidationMessages } from '../../src/core/validationMessages';
import {
  assert500WithGenericMessage,
  assertBadRequestWithMessage,
  assertStatusCode,
  describeInvalidId,
  saveUrl,
  sendGetRequest,
  setExceptionStorageStub,
  url,
  validId,
} from './utilities';
import Context from '../../src/adapter-restapi-express/context';
import { FakeUrlStorage } from '../../src/adapter-persistence-fake/fakeUrlStorage';

async function sendRequest(id: string) {
  return await sendGetRequest('/' + id);
}

describe('GET /<id>', () => {
  test('responds 400 for empty id', async () => {
    const response = await sendRequest('');

    assertBadRequestWithMessage(response, ValidationMessages.ID_REQUIRED);
  });

  describeInvalidId((id, errorMessage) => {
    test(`returns 400 for id: ${id}`, async () => {
      const response = await sendRequest(id as string);

      assertBadRequestWithMessage(response, errorMessage);
    });
  });

  test('responds 500 for unknown exceptions', async () => {
    setExceptionStorageStub();

    const response = await sendRequest(validId);

    assert500WithGenericMessage(response);
  });

  test('responds 400 if id does not exist', async () => {
    const response = await sendRequest(validId);

    assertBadRequestWithMessage(response, ValidationMessages.ID_DOES_NOT_EXIST);
  });

  test('responds with a 301 redirect if id exists', async () => {
    await saveUrl();

    const response = await sendRequest(url.getShortenedId());

    assertStatusCode(response, 301);
    expect(response.headers.location).toBe(url.getLongUrl());
  });

  afterEach(() => {
    Context.urlStorage = new FakeUrlStorage();
  });
});
