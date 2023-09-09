import request from 'supertest';
import app from '../../src/adapter-restapi-express/app';
import { Url } from '../../src/core/domain/url';
import Context from '../../src/adapter-restapi-express/context';
import { ExceptionStorageStub } from './exceptionStorageStub';
import { ID_DOES_NOT_EXIST, ID_INVALID } from '../core/utilities';
import { LoggerSpy } from './loggerSpy';
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

export function assert500WithGenericMessage(response) {
  assertStatusCode(response, 500);
  assertBody(response, {
    message: Messages.SERVER_ERROR,
  });
}

export function assertStorageStubErrorWasLogged() {
  assertLogErrorWasCalledWith(ExceptionStorageStub.stubError);
}

export function assertValidationErrorWasLoggedWithMessage(message: string) {
  assertLogErrorWasCalledWith(new ValidationError(message));
}

function assertLogErrorWasCalledWith(error: Error) {
  expect(LoggerSpy.wasCalled).toBe(true);
  expect(LoggerSpy.wasCalledWith).toStrictEqual(error);
}

export function sendGetRequest(path: string) {
  return request(app).get(path);
}

export const Messages = {
  SERVER_ERROR: 'Server Error',
};

export async function saveUrl() {
  await Context.urlStorage.save(url);
}

export function setExceptionStorageStub() {
  Context.urlStorage = new ExceptionStorageStub();
}

export function setLoggerSpy() {
  const spy = new LoggerSpy();
  Context.logger = spy;
}

export function buildShortUrl(id: string) {
  return `https://${process.env.SERVER_DOMAIN}/${id}`;
}

export const validId = 'googleId1';

export const url = new Url('https://google.com', validId, 0);

export function describeBadId(
  testInvalidId: (id: string | undefined, errorMessage: string) => void
) {
  describe.each(getInvalidIdTests())('Invalid id', (id, errorMessage) => {
    testInvalidId(id, errorMessage);
  });

  function getInvalidIdTests(): readonly (
    | [string, string]
    | [undefined, string]
  )[] {
    return [
      ['longIdWith12', ID_INVALID],
      ['shortId', ID_INVALID],
      ['google*d2', ID_INVALID],
      [validId, ID_DOES_NOT_EXIST],
    ];
  }
}
