import {
  ShortenUseCase,
  ShortenUseCaseResponse,
} from '../../../src/core/useCases/shortenUseCase';
import { Url } from '../../../src/core/domain/url';
import { UrlStorage } from '../../../src/core/ports/urlStorage';
import { GeneratorSpy } from '../generatorSpy';
import {
  assertLogInfoCalls,
  assertValidationErrorWithMessage,
} from '../utilities';
import { FakeUrlStorage } from '../../../src/adapter-persistence-fake/fakeUrlStorage';
import DailyClickCountStat from '../../../src/core/domain/dailyClickCountStat';
import { DeviceTypePercentage } from '../../../src/core/domain/deviceTypePercentage';
import { LoggerSpy } from '../loggerSpy';

const URL_REQUIRED = 'URL is required';
const URL_INVALID = 'URL is not valid';

let generatorSpy: GeneratorSpy;
let url: Url;
let loggerSpy: LoggerSpy;

function createUseCase(storage?: UrlStorage) {
  generatorSpy = new GeneratorSpy();
  url = new Url('https://yahoo.com', generatorSpy.generatedId, 0);
  loggerSpy = new LoggerSpy();
  return new ShortenUseCase(
    storage || createStorage(),
    generatorSpy,
    loggerSpy
  );
}

function createStorage() {
  return new FakeUrlStorage();
}

async function assertUrlWasSaved(storage: FakeUrlStorage) {
  expect(await storage.findByLongUrl(url.getLongUrl())).toMatchObject(
    new Url(url.getLongUrl(), generatorSpy.generatedId, 0)
  );
}

function assertGeneratorAndSaveWereNotCalled(storageSpy: StorageSpy) {
  expect(storageSpy.saveWasCalled).toBe(false);
  expect(generatorSpy.wasCalled).toBe(false);
}

function assertResponsesMatch(
  response1: ShortenUseCaseResponse,
  response2: ShortenUseCaseResponse
) {
  expect(response1).toMatchObject(response2);
}

test('throws if url is empty', async () => {
  const uC = createUseCase();

  await assertValidationErrorWithMessage(() => uC.execute(''), URL_REQUIRED);
});

test('throws if url is undefined', async () => {
  const uC = createUseCase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let url: any;

  await assertValidationErrorWithMessage(() => uC.execute(url), URL_REQUIRED);
});

test('throws if url is not valid http', async () => {
  const uC = createUseCase();

  await assertValidationErrorWithMessage(
    () => uC.execute('invalid url'),
    URL_INVALID
  );
});

test('saves shortened url', async () => {
  const storage = createStorage();
  const uC = createUseCase(storage);

  await uC.execute(url.getLongUrl());

  await assertUrlWasSaved(storage);
});

test('returns correct response for a new url', async () => {
  const uC = createUseCase();

  const response = await uC.execute(url.getLongUrl());

  assertResponsesMatch(response, {
    longUrl: url.getLongUrl(),
    shortenedId: generatorSpy.generatedId,
    preexisting: false,
  });
});

test('does not save and generate id for a preexisting url', async () => {
  const spy = new StorageSpy();
  const uC = createUseCase(spy);

  await uC.execute(spy.preexistingUrl.getLongUrl());

  assertGeneratorAndSaveWereNotCalled(spy);
});

test('returns correct response for a preexisting url', async () => {
  const storage = createStorage();
  storage.save(url);
  const uC = createUseCase(storage);

  const response = await uC.execute(url.getLongUrl());

  assertResponsesMatch(response, {
    longUrl: url.getLongUrl(),
    shortenedId: url.getShortenedId(),
    preexisting: true,
  });
});

test('logs if preexisting url is not found', async () => {
  const lU = url.getLongUrl();
  const uC = createUseCase();

  await uC.execute(lU);

  assertLogInfoCalls(loggerSpy, [
    [`Didn't find preexisting url(${lU})`],
    ['Created new url', url],
  ]);
});

test('logs if preexisting url is found', async () => {
  const storage = createStorage();
  storage.save(url);
  const uC = createUseCase(storage);

  await uC.execute(url.getLongUrl());

  assertLogInfoCalls(loggerSpy, [[`Found preexisting url`, url]]);
});

class StorageSpy implements UrlStorage {
  saveWasCalled = false;
  preexistingUrl = url;

  getTop3DeviceTypes(): Promise<DeviceTypePercentage[]> {
    throw new Error('Method not implemented.');
  }

  saveClick(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getTotalClicksByDay(): Promise<DailyClickCountStat> {
    throw new Error('Method not implemented.');
  }

  findById(): Promise<Url | null> {
    throw new Error('Method not implemented.');
  }

  async save() {
    this.saveWasCalled = true;
  }

  async findByLongUrl(): Promise<Url | null> {
    return this.preexistingUrl;
  }
}
