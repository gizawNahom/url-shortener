import { FakeUrlStorage } from '../../src/adapter-persistence-fake/fakeUrlStorage';
import Context from '../../src/adapter-restapi-express/context';
import { Click } from '../../src/core/domain/click';
import { UrlId } from '../../src/core/domain/urlId';
import { ValidationMessages } from '../../src/core/validationMessages';
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

async function sendRequest(id: string) {
  return await sendGetRequest(`/api/urls/${id}/top-device-types`);
}

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

test('returns 400 for an unsaved valid id', async () => {
  const response = await sendRequest(validId);

  assertBadRequestWithMessage(response, ValidationMessages.ID_DOES_NOT_EXIST);
});

test('returns 200 for a saved valid id', async () => {
  const clickDate = new Date();
  await saveUrl();
  Context.urlStorage.saveClick(
    new Click(new UrlId(validId), clickDate, 'DESKTOP')
  );

  const response = await sendRequest(validId);

  assertStatusCode(response, 200);
  assertBody(response, { devices: [{ type: 'DESKTOP', percentage: 1 }] });
});