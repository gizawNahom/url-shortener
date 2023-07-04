import { FakeUrlStorage } from '../../../src/adapter-persistence-fake/fakeUrlStorage';
import { Url } from '../../../src/core/domain/url';
import { UrlStorage } from '../../../src/core/ports/urlStorage';
import { GetUrlUseCase } from '../../../src/core/useCases/getUrlUseCase';
import {
  ID_DOES_NOT_EXIST,
  ID_INVALID,
  ID_REQUIRED,
  assertValidationErrorWithMessage,
} from '../utilities';

const validId = 'googleId1';

function createUseCase(urlStorage?: UrlStorage) {
  return new GetUrlUseCase(urlStorage ?? new FakeUrlStorage());
}

describe.each([
  ['', ID_REQUIRED],
  ['longIdWith12', ID_INVALID],
  [undefined, ID_REQUIRED],
])('Invalid id', (id, errorMessage) => {
  test(`throws with "${errorMessage}" if id is "${id}"`, () => {
    const uC = createUseCase();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id1: any = id;
    assertValidationErrorWithMessage(async () => {
      await uC.getUrl(id1);
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
