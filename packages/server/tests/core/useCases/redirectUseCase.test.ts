import { RedirectUseCase } from '../../../src/core/useCases/redirectUseCase';
import { Url } from '../../../src/core/domain/url';
import { FakeUrlStorage } from '../../../src/adapter-persistence-fake/fakeUrlStorage';
import {
  ID_DOES_NOT_EXIST,
  assertValidationErrorWithMessage,
  describeInvalidId,
  tabletDeviceType,
  getTodayString,
} from '../utilities';
import { UrlId } from '../../../src/core/domain/urlId';
import { assertSavedDeviceType } from '../../utilities';

const url = new Url('https://google.com', 'googleId1', 0);

let storageFake: FakeUrlStorage;

function createUseCase() {
  storageFake = new FakeUrlStorage();
  return new RedirectUseCase(storageFake);
}

function executeUseCase(rUC: RedirectUseCase, id: string) {
  return rUC.execute(id, tabletDeviceType);
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
      async () => await executeUseCase(rUC, id as string),
      errorMessage
    );
  });
});

test('throws if id does not exist', async () => {
  const unsavedId = 'fe3e56789';
  const rUC = createUseCase();

  assertValidationErrorWithMessage(
    async () => await executeUseCase(rUC, unsavedId),
    ID_DOES_NOT_EXIST
  );
});

test('returns redirect url', async () => {
  const rUC = createUseCase();
  storageFake.save(url);

  const longUrl = await executeUseCase(rUC, url.getShortenedId());

  expect(longUrl).toBe(url.getLongUrl());
});

test('registers click', async () => {
  const rUC = createUseCase();
  storageFake.save(url);

  await executeUseCase(rUC, url.getShortenedId());

  await assertCorrectClickCountStat();
  await assertSavedDeviceType(
    storageFake,
    url.getShortenedId(),
    tabletDeviceType
  );
});
