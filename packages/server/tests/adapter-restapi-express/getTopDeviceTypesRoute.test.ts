import { FakeUrlStorage } from '../../src/adapter-persistence-fake/fakeUrlStorage';
import Context from '../../src/adapter-restapi-express/context';
import { saveClick } from '../utilities';
import {
  assert500WithGenericMessage,
  assertBody,
  assertStatusCode,
  saveUrl,
  sendGetRequest,
  setExceptionStorageStub,
  testBadIds,
  validId,
} from './utilities';

async function sendRequest(id: string) {
  return await sendGetRequest(`/api/urls/${id}/top-device-types`);
}

beforeEach(() => {
  Context.urlStorage = new FakeUrlStorage();
});

testBadIds(sendRequest);

test('returns 500 for unknown exception', async () => {
  setExceptionStorageStub();

  const response = await sendRequest(validId);

  assert500WithGenericMessage(response);
});

test('returns 200 for a saved valid id', async () => {
  const deviceType = 'desktop';
  await saveUrl();
  saveClick({ id: validId, deviceType });

  const response = await sendRequest(validId);

  assertStatusCode(response, 200);
  assertBody(response, { devices: [{ type: deviceType, percentage: 1 }] });
});
