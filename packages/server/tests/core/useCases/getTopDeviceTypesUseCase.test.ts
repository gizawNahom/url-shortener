import { FakeUrlStorage } from '../../../src/adapter-persistence-fake/fakeUrlStorage';
import { Click } from '../../../src/core/domain/click';
import { DeviceTypePercentage } from '../../../src/core/domain/deviceTypePercentage';
import { Url } from '../../../src/core/domain/url';
import { UrlId } from '../../../src/core/domain/urlId';
import {
  GetTopDeviceTypesUseCase,
  GetTopDevicesUseCaseResponse,
} from '../../../src/core/useCases/getTopDeviceTypesUseCase';
import {
  ID_DOES_NOT_EXIST,
  assertValidationErrorWithMessage,
  describeInvalidId,
} from '../utilities';

let storage: FakeUrlStorage;
const validId = 'googleId1';
const DESKTOP = 'DESKTOP';

function createUseCase() {
  return new GetTopDeviceTypesUseCase(storage);
}

function getTopDeviceTypes(
  uC: GetTopDeviceTypesUseCase,
  id: string | undefined
): Promise<GetTopDevicesUseCaseResponse> {
  return uC.getTopDevices(id as string);
}

async function saveUrl() {
  await storage.save(new Url('https://google1.com', validId, 0));
}

beforeEach(() => {
  storage = new FakeUrlStorage();
});

describeInvalidId((id, errorMessage) => {
  test(`throws with "${errorMessage}" if id is "${id}"`, async () => {
    const uC = createUseCase();

    await assertValidationErrorWithMessage(
      () => getTopDeviceTypes(uC, id),
      errorMessage
    );
  });
});

test('throws validation error if url was not saved', async () => {
  const uC = createUseCase();

  await assertValidationErrorWithMessage(
    () => getTopDeviceTypes(uC, validId),
    ID_DOES_NOT_EXIST
  );
});

test('returns correct response for a url with zero clicks', async () => {
  await saveUrl();
  const uC = createUseCase();

  const response = await getTopDeviceTypes(uC, validId);

  expect(response).toEqual({
    devices: [],
  });
});

test('returns correct response for a single click', async () => {
  await saveUrl();
  await storage.saveClick(new Click(new UrlId(validId), new Date(), DESKTOP));
  const uC = createUseCase();

  const response = await getTopDeviceTypes(uC, validId);

  expect(response).toEqual({
    devices: [new DeviceTypePercentage(DESKTOP, 1)],
  });
});

test('returns correct response for two clicks from two device types', async () => {
  await saveUrl();
  await storage.saveClick(new Click(new UrlId(validId), new Date(), DESKTOP));
  await storage.saveClick(new Click(new UrlId(validId), new Date(), DESKTOP));
  await storage.saveClick(new Click(new UrlId(validId), new Date(), 'MOBILE'));
  const uC = createUseCase();

  const response = await getTopDeviceTypes(uC, validId);

  expect(response).toEqual({
    devices: [
      new DeviceTypePercentage(DESKTOP, 2 / 3),
      new DeviceTypePercentage('MOBILE', 1 / 3),
    ],
  });
});
