import { RedirectUseCase } from '../../../src/core/useCases/redirectUseCase';
import { Url } from '../../../src/core/domain/url';
import { FakeUrlStorage } from '../../../src/adapter-persistence-fake/fakeUrlStorage';
import {
  ID_DOES_NOT_EXIST,
  assertValidationErrorWithMessage,
  describeInvalidId,
  getTodayString,
} from '../utilities';
import { UrlStorage } from '../../../src/core/ports/urlStorage';
import DailyClickCountStat, {
  DailyClickCount,
} from '../../../src/core/domain/dailyClickCountStat';
import { UrlId } from '../../../src/core/domain/urlId';

const url = new Url('https://google.com', 'googleId1', 0);

let storageFake: UrlStorage;

function createUseCase() {
  storageFake = new FakeUrlStorage();
  return new RedirectUseCase(storageFake);
}

async function assertCorrectClickCountStat() {
  const dateString = getTodayString();
  expect(
    await storageFake.getTotalClicksByDay(new UrlId(url.getShortenedId()))
  ).toEqual(new DailyClickCountStat(1, [new DailyClickCount(dateString, 1)]));
}

describeInvalidId((id, errorMessage) => {
  test(`throws with "${errorMessage}" if id is "${id}"`, () => {
    const rUC = createUseCase();

    assertValidationErrorWithMessage(
      async () => await rUC.execute(id as string),
      errorMessage
    );
  });
});

test('throws if id does not exist', async () => {
  const rUC = createUseCase();

  assertValidationErrorWithMessage(
    async () => await rUC.execute('fe3e56789'),
    ID_DOES_NOT_EXIST
  );
});

test('returns redirect url', async () => {
  const rUC = createUseCase();
  storageFake.save(url);

  const longUrl = await rUC.execute(url.getShortenedId());

  expect(longUrl).toBe(url.getLongUrl());
});

test('registers click', async () => {
  const rUC = createUseCase();
  storageFake.save(url);

  await rUC.execute(url.getShortenedId());

  await assertCorrectClickCountStat();
});
