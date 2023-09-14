import { FakeUrlStorage } from '../../../src/adapter-persistence-fake/fakeUrlStorage';
import { Url } from '../../../src/core/domain/url';
import { UrlStorage } from '../../../src/core/ports/urlStorage';
import { GetUrlUseCase } from '../../../src/core/useCases/getUrlUseCase';
import { LoggerSpy } from '../loggerSpy';
import {
  ID_DOES_NOT_EXIST,
  assertLogInfoCalls,
  assertValidationErrorWithMessage,
  buildFoundUrlLogMessage,
  describeInvalidId,
} from '../utilities';

const validId = 'googleId1';
let loggerSpy: LoggerSpy;

function createUseCase(urlStorage?: UrlStorage) {
  loggerSpy = new LoggerSpy();
  return new GetUrlUseCase(urlStorage ?? new FakeUrlStorage(), loggerSpy);
}

describeInvalidId((id: string | undefined, errorMessage: string) => {
  test(`throws with "${errorMessage}" if id is "${id}"`, () => {
    const uC = createUseCase();

    assertValidationErrorWithMessage(async () => {
      await uC.getUrl(id as string);
    }, errorMessage);
  });
});

test('throws if id does not exist', () => {
  const uC = createUseCase();

  assertValidationErrorWithMessage(async () => {
    await uC.getUrl(validId);
  }, ID_DOES_NOT_EXIST);
});

test('returns saved url', async () => {
  const storageFake = new FakeUrlStorage();
  const url = new Url('https://google.com', validId, 0);
  storageFake.save(url);
  const uC = createUseCase(storageFake);

  const u = await uC.getUrl(validId);

  expect(u).toEqual(url);
});

test('logs if url was found', async () => {
  const storageFake = new FakeUrlStorage();
  const url = new Url('https://google.com', validId, 0);
  storageFake.save(url);
  const uC = createUseCase(storageFake);

  await uC.getUrl(validId);

  assertLogInfoCalls(loggerSpy, [[buildFoundUrlLogMessage(validId), url]]);
});
