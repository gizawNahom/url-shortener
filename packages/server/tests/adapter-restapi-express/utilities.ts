import request from 'supertest';
import app from '../../src/adapter-restapi-express/app';
import { Url } from '../../src/core/domain/url';
import Context from '../../src/adapter-restapi-express/context';
import { ExceptionStorageStub } from './ExceptionStorageStub';

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

export async function sendGetRequest(path: string) {
  return await request(app).get(path);
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

export function buildShortUrl(id: string) {
  return `https://${process.env.domain}/${id}`;
}

export const validId = 'googleId1';

export const url = new Url('https://google.com', validId, 0);
