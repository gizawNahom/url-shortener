import { FakeUrlStorage } from '../../../src/adapter-persistence-fake/fakeUrlStorage';
import { TotalClicksUseCase } from '../../../src/core/useCases/totalClicksUseCase';
import { Url } from '../../../src/core/domain/url';
import {
  ID_DOES_NOT_EXIST,
  assertValidationErrorWithMessage,
  describeInvalidId,
  getDateString,
} from '../utilities';
import { UrlStorage } from '../../../src/core/ports/urlStorage';
import Context from '../../../src/adapter-restapi-express/context';
import { saveClick as sC } from '../../utilities';
import { LoggerSpy } from '../loggerSpy';

let storage: UrlStorage;
const validId1 = 'googleId1';
const validId2 = 'googleId2';
const clickDate1 = new Date();
const clickDate2 = new Date(1999, 1, 1);
let loggerSpy: LoggerSpy;

function saveUrlAndClickItOnce() {
  saveUrl(validId1);
  saveClick(validId1, clickDate1);
}

function saveUrlAndClickItTwice() {
  saveUrl(validId1);
  saveClick(validId1, clickDate2);
  saveClick(validId1, clickDate1);
}

function saveTwoUrlsAndClickBothOnce() {
  saveUrl(validId1);
  saveClick(validId1, clickDate1);
  saveUrl(validId2, 'https://google2.com');
  saveClick(validId2, clickDate2);
}

function saveUrl(id: string, longUrl?: string) {
  storage.save(new Url(longUrl ?? 'https://google1.com', id, 0));
}

function saveClick(id: string, clickDate: Date) {
  sC({ id, clickDate });
}

function createTotalClicksUseCase() {
  loggerSpy = new LoggerSpy();
  return new TotalClicksUseCase(storage, loggerSpy);
}

function getTotalClicksByDay(uC: TotalClicksUseCase, id: string) {
  return uC.getTotalClicksByDay(id);
}

function buildExpectedUseCaseResponse(
  totalClicks: number,
  dailyClickCounts: { day: string; totalClicks: number }[]
) {
  return {
    totalClicks: totalClicks,
    dailyClickCounts: dailyClickCounts,
  };
}

function assertObjectEquality(obj1, obj2) {
  expect(obj1).toEqual(obj2);
}

beforeEach(() => {
  storage = new FakeUrlStorage();
  Context.urlStorage = storage;
});

describeInvalidId((id, errorMessage) => {
  test(`throws with "${errorMessage}" if id is "${id}"`, async () => {
    const uC = createTotalClicksUseCase();

    await assertValidationErrorWithMessage(
      () => getTotalClicksByDay(uC, id as string),
      errorMessage
    );
  });
});

test('returns correct response for zero clicks', async () => {
  saveUrl(validId1);
  const uC = createTotalClicksUseCase();

  const response = await getTotalClicksByDay(uC, validId1);

  expect(response).toEqual(buildExpectedUseCaseResponse(0, []));
});

test('returns correct response for one click', async () => {
  saveUrlAndClickItOnce();
  const uC = createTotalClicksUseCase();

  const response = await getTotalClicksByDay(uC, validId1);

  assertObjectEquality(
    response,
    buildExpectedUseCaseResponse(1, [
      { day: getDateString(clickDate1), totalClicks: 1 },
    ])
  );
});

test('returns correct response for two clicks of the same id', async () => {
  saveUrlAndClickItTwice();
  const uC = createTotalClicksUseCase();

  const response = await getTotalClicksByDay(uC, validId1);

  assertObjectEquality(
    response,
    buildExpectedUseCaseResponse(2, [
      { day: getDateString(clickDate2), totalClicks: 1 },
      { day: getDateString(clickDate1), totalClicks: 1 },
    ])
  );
});

test('returns correct response for two clicks of different id', async () => {
  saveTwoUrlsAndClickBothOnce();
  const uC = createTotalClicksUseCase();

  const response1 = await getTotalClicksByDay(uC, validId1);
  const response2 = await getTotalClicksByDay(uC, validId2);

  assertObjectEquality(
    response1,
    buildExpectedUseCaseResponse(1, [
      { day: getDateString(clickDate1), totalClicks: 1 },
    ])
  );
  assertObjectEquality(
    response2,
    buildExpectedUseCaseResponse(1, [
      { day: getDateString(clickDate2), totalClicks: 1 },
    ])
  );
});

test('throws validation error if url was not saved', async () => {
  const uC = createTotalClicksUseCase();

  await assertValidationErrorWithMessage(
    () => getTotalClicksByDay(uC, 'googleId1'),
    ID_DOES_NOT_EXIST
  );
});

test('logs info for happy path', async () => {
  saveUrl(validId1);
  const uC = createTotalClicksUseCase();

  await getTotalClicksByDay(uC, validId1);

  expect(loggerSpy.logInfoCalls.length).toBe(2);
  expect(loggerSpy.logInfoCalls[0]).toBe(
    `Checked URL registration by id(${validId1})`
  );
  expect(loggerSpy.logInfoCalls[1]).toBe(
    `Fetched total clicks by day using id(${validId1})`
  );
});
