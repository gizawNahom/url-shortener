import { FakeUrlStorage } from '../../../src/adapter-persistence-fake/fakeUrlStorage';
import Context from '../../../src/adapter-restapi-express/context';
import { DeviceTypePercentage } from '../../../src/core/domain/deviceTypePercentage';
import { Url } from '../../../src/core/domain/url';
import {
  GetTopDeviceTypesUseCase,
  GetTopDevicesUseCaseResponse,
} from '../../../src/core/useCases/getTopDeviceTypesUseCase';
import { saveClick as sC } from '../../utilities';
import { LoggerSpy } from '../loggerSpy';
import {
  ID_DOES_NOT_EXIST,
  assertValidationErrorWithMessage,
  describeInvalidId,
  TABLET_DEVICE_TYPE,
  assertLogInfoCalls,
  buildUrlRegistrationLogMessage,
} from '../utilities';

let storage: FakeUrlStorage;
let loggerSpy: LoggerSpy;
const validId = 'googleId1';

function createUseCase() {
  loggerSpy = new LoggerSpy();
  return new GetTopDeviceTypesUseCase(storage, loggerSpy);
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

async function saveClickWithTabletDeviceType() {
  await saveClick(TABLET_DEVICE_TYPE);
}

async function saveClick(deviceType: string) {
  await sC({ id: validId, deviceType });
}

beforeEach(() => {
  storage = new FakeUrlStorage();
  Context.urlStorage = storage;
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
  await saveClickWithTabletDeviceType();
  const uC = createUseCase();

  const response = await getTopDeviceTypes(uC, validId);

  expect(response).toEqual({
    devices: [new DeviceTypePercentage(TABLET_DEVICE_TYPE, 1)],
  });
});

test('returns correct response for two clicks from two device types', async () => {
  const mobileDeviceType = 'mobile';
  await saveUrl();
  await saveClickWithTabletDeviceType();
  await saveClickWithTabletDeviceType();
  await saveClick(mobileDeviceType);
  const uC = createUseCase();

  const response = await getTopDeviceTypes(uC, validId);

  expect(response).toEqual({
    devices: [
      new DeviceTypePercentage(TABLET_DEVICE_TYPE, 2 / 3),
      new DeviceTypePercentage(mobileDeviceType, 1 / 3),
    ],
  });
});

test('logs info for happy path', async () => {
  await saveUrl();
  await saveClickWithTabletDeviceType();
  const uC = createUseCase();

  await getTopDeviceTypes(uC, validId);

  assertLogInfoCalls(loggerSpy, [
    [buildUrlRegistrationLogMessage(validId)],
    [
      `Fetched top 3 device types using id(${validId})`,
      [new DeviceTypePercentage(TABLET_DEVICE_TYPE, 1)],
    ],
  ]);
});
