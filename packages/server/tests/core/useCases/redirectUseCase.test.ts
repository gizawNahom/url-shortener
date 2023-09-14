import { RedirectUseCase } from '../../../src/core/useCases/redirectUseCase';
import { Url } from '../../../src/core/domain/url';
import { FakeUrlStorage } from '../../../src/adapter-persistence-fake/fakeUrlStorage';
import {
  ID_DOES_NOT_EXIST,
  assertValidationErrorWithMessage,
  describeInvalidId,
  TABLET_DEVICE_TYPE,
  getTodayString,
  assertLogInfoCalls,
  buildFoundUrlLogMessage,
} from '../utilities';
import { UrlId } from '../../../src/core/domain/urlId';
import { assertSavedDeviceType } from '../../utilities';
import { LoggerSpy } from '../loggerSpy';
import { Click } from '../../../src/core/domain/click';

const url = new Url('https://google.com', 'googleId1', 0);

let storageFake: FakeUrlStorage;
let loggerSpy: LoggerSpy;

function createUseCase() {
  storageFake = new FakeUrlStorage();
  loggerSpy = new LoggerSpy();
  return new RedirectUseCase(storageFake, loggerSpy);
}

function executeUseCase(rUC: RedirectUseCase, id: string, deviceType?: string) {
  return rUC.execute(id, deviceType);
}

function executeUseCaseWithTablet(rUC: RedirectUseCase, id: string) {
  return executeUseCase(rUC, id, TABLET_DEVICE_TYPE);
}

async function assertCorrectClickCountStat() {
  const todayWithOutMilliSeconds = getTodayString().slice(0, -4);
  const stat = await storageFake.getTotalClicksByDay(
    new UrlId(url.getShortenedId())
  );

  const dailyClickCounts = stat.getDailyClickCounts();
  expect(stat.getTotalClicks()).toBe(1);
  expect(dailyClickCounts.length).toBe(1);
  expect(dailyClickCounts[0].getTotalClicks()).toBe(1);
  expect(dailyClickCounts[0].getDay()).toContain(todayWithOutMilliSeconds);
}

describeInvalidId((id, errorMessage) => {
  test(`throws with "${errorMessage}" if id is "${id}"`, () => {
    const rUC = createUseCase();

    assertValidationErrorWithMessage(
      async () => await executeUseCaseWithTablet(rUC, id as string),
      errorMessage
    );
  });
});

test('throws if id does not exist', async () => {
  const unsavedId = 'fe3e56789';
  const rUC = createUseCase();

  assertValidationErrorWithMessage(
    async () => await executeUseCaseWithTablet(rUC, unsavedId),
    ID_DOES_NOT_EXIST
  );
});

test('returns redirect url', async () => {
  const rUC = createUseCase();
  storageFake.save(url);

  const longUrl = await executeUseCaseWithTablet(rUC, url.getShortenedId());

  expect(longUrl).toBe(url.getLongUrl());
});

test('registers click', async () => {
  const rUC = createUseCase();
  storageFake.save(url);

  await executeUseCaseWithTablet(rUC, url.getShortenedId());

  await assertCorrectClickCountStat();
  await assertSavedDeviceType(
    storageFake,
    url.getShortenedId(),
    TABLET_DEVICE_TYPE
  );
});

test('saves "desktop" for unknown device types', async () => {
  const rUC = createUseCase();
  storageFake.save(url);

  await executeUseCase(rUC, url.getShortenedId(), undefined);

  await assertCorrectClickCountStat();
  await assertSavedDeviceType(storageFake, url.getShortenedId(), 'desktop');
});

test('logs happy path', async () => {
  const rUC = createUseCase();
  const id = url.getShortenedId();
  storageFake.save(url);

  await executeUseCaseWithTablet(rUC, id);

  assertLogInfoCalls(loggerSpy, [
    [buildFoundUrlLogMessage(id), url],
    [
      `Saved click using id(${id})`,
      new Click(
        new UrlId(url.getShortenedId()),
        new Date(),
        TABLET_DEVICE_TYPE
      ),
    ],
  ]);
});
