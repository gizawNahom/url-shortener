import { RedirectUseCase } from '../../../src/core/useCases/redirectUseCase';
import { Url } from '../../../src/core/domain/url';
import { FakeUrlStorage } from '../../../src/adapter-persistence-fake/fakeUrlStorage';
import {
  ID_INVALID,
  ID_REQUIRED,
  assertValidationErrorWithMessage,
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

test('throws if id is empty', async () => {
  const rUC = createUseCase();

  assertValidationErrorWithMessage(
    async () => await rUC.execute(''),
    ID_REQUIRED
  );
});

test('throws if id is longer than 9 characters', async () => {
  const rUC = createUseCase();

  assertValidationErrorWithMessage(
    async () => await rUC.execute('longIdWith12'),
    ID_INVALID
  );
});

test('throws if id is undefined', async () => {
  const rUC = createUseCase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let id: any;

  assertValidationErrorWithMessage(
    async () => await rUC.execute(id),
    ID_REQUIRED
  );
});

test('throws if id does not exist', async () => {
  const rUC = createUseCase();

  assertValidationErrorWithMessage(
    async () => await rUC.execute('fe3e56789'),
    'Id does not exist'
  );
});

test('throws if id is less than 9 characters', async () => {
  const rUC = createUseCase();

  assertValidationErrorWithMessage(
    async () => await rUC.execute('fe34'),
    ID_INVALID
  );
});

test('throws if id contains "_"', async () => {
  const rUC = createUseCase();

  assertValidationErrorWithMessage(
    async () => await rUC.execute('fe345_789'),
    ID_INVALID
  );
});

test('throws if id contains "-"', async () => {
  const rUC = createUseCase();

  assertValidationErrorWithMessage(
    async () => await rUC.execute('fe345-789'),
    ID_INVALID
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
