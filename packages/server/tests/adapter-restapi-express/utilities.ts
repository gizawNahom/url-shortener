import request from 'supertest';
import { Response } from 'supertest';
import app from '../../src/adapter-restapi-express/app';
import { Url } from '../../src/core/domain/url';
import Context from '../../src/adapter-restapi-express/context';
import { ExceptionStorageStub } from './exceptionStorageStub';
import { ID_DOES_NOT_EXIST, invalidIds } from '../core/utilities';
import { LoggerSpy } from '../core/loggerSpy';
import { ValidationError } from '../../src/core/validationError';

export function assertBadRequestWithMessage(response, message: string) {
  assertStatusCode(response, 400);
  assertBody(response, { message: message });
}

export function assertStatusCode(response, statusCode: number) {
  expect(response.statusCode).toBe(statusCode);
}

export function assertBody(response, body: unknown) {
  expect(response.body).toEqual(body);
}

export function assertValidationErrorWasLoggedWithMessage(
  loggerSpy: LoggerSpy,
  message: string
) {
  assertLogErrorWasCalledWith(loggerSpy, new ValidationError(message));
}

export function sendGetRequest(path: string) {
  return request(app).get(path);
}

const Messages = {
  SERVER_ERROR: 'Server Error',
};

export async function saveUrl() {
  await Context.urlStorage.save(url);
}

export function createLoggerSpy() {
  return new LoggerSpy();
}

export function setLoggerSpy(spy: LoggerSpy) {
  Context.logger = spy;
}

export function buildShortUrl(id: string) {
  return `https://${process.env.SERVER_DOMAIN}/${id}`;
}

export const validId = 'googleId1';

export const url = new Url('https://google.com', validId, 0);

export function testBadIds(sendRequest: (id: string) => Promise<Response>) {
  describeBadId((id, errorMessage) => {
    test(`logs and returns 400 with "${errorMessage}" for id: ${id}`, async () => {
      const spy = createLoggerSpy();
      setLoggerSpy(spy);

      const response = await sendRequest(id as string);

      assertBadRequestWithMessage(response, errorMessage);
      assertValidationErrorWasLoggedWithMessage(spy, errorMessage);
    });
  });

  function describeBadId(
    testInvalidId: (id: string | undefined, errorMessage: string) => void
  ) {
    describe.each(getInvalidIdTests())('Invalid id', (id, errorMessage) => {
      testInvalidId(id, errorMessage);
    });

    function getInvalidIdTests(): readonly (
      | [string, string]
      | [undefined, string]
    )[] {
      return [[validId, ID_DOES_NOT_EXIST], ...invalidIds];
    }
  }
}

export function testUnknownException(sendRequest: () => Promise<Response>) {
  test('logs and responds 500 for unknown exception', async () => {
    setExceptionStorageStub();
    const spy = createLoggerSpy();
    setLoggerSpy(spy);

    const response = await sendRequest();

    assert500WithGenericMessage(response);
    assertStorageStubErrorWasLogged(spy);
  });

  function setExceptionStorageStub() {
    Context.urlStorage = new ExceptionStorageStub();
  }

  function assert500WithGenericMessage(response) {
    assertStatusCode(response, 500);
    assertBody(response, {
      message: Messages.SERVER_ERROR,
    });
  }

  function assertStorageStubErrorWasLogged(loggerSpy: LoggerSpy) {
    assertLogErrorWasCalledWith(loggerSpy, ExceptionStorageStub.stubError);
  }
}

function assertLogErrorWasCalledWith(loggerSpy: LoggerSpy, error: Error) {
  expect(loggerSpy.logErrorWasCalledWith).toStrictEqual(error);
}
