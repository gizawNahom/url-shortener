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
  URL_REGISTRATION_LOG_MESSAGE,
  assertValidationErrorWithMessage,
  describeInvalidId,
  tabletDeviceType,
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
  await saveClick(tabletDeviceType);
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
    devices: [new DeviceTypePercentage(tabletDeviceType, 1)],
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
      new DeviceTypePercentage(tabletDeviceType, 2 / 3),
      new DeviceTypePercentage(mobileDeviceType, 1 / 3),
    ],
  });
});

test('logs info for happy path', async () => {
  await saveUrl();
  const uC = createUseCase();

  await getTopDeviceTypes(uC, validId);

  expect(loggerSpy.logInfoCalls.length).toBe(2);
  expect(loggerSpy.logInfoCalls[0]).toBe(
    `${URL_REGISTRATION_LOG_MESSAGE}(${validId})`
  );
  expect(loggerSpy.logInfoCalls[1]).toBe(
    `Fetched top 3 device types using id(${validId})`
  );
});
