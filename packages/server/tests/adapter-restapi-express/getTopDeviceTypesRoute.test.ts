import { FakeUrlStorage } from '../../src/adapter-persistence-fake/fakeUrlStorage';
import Context from '../../src/adapter-restapi-express/context';
import { saveClick } from '../utilities';
import {
  assertBody,
  assertStatusCode,
  saveUrl,
  sendGetRequest,
  testBadIds,
  testUnknownException,
  validId,
} from './utilities';

async function sendRequest(id: string) {
  return await sendGetRequest(`/api/urls/${id}/top-device-types`);
}

describe('GET /api/urls/<id>/top-device-types', () => {
  beforeEach(() => {
    Context.urlStorage = new FakeUrlStorage();
  });

  testBadIds(sendRequest);

  testUnknownException(() => sendRequest(validId));

  test('returns 200 for a saved valid id', async () => {
    const deviceType = 'desktop';
    await saveUrl();
    saveClick({ id: validId, deviceType });

    const response = await sendRequest(validId);

    assertStatusCode(response, 200);
    assertBody(response, { devices: [{ type: deviceType, percentage: 1 }] });
  });
});
