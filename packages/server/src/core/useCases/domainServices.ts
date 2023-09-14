import { Url } from '../domain/url';
import { UrlId } from '../domain/urlId';
import { Logger } from '../ports/logger';
import { UrlStorage } from '../ports/urlStorage';
import { ValidationError } from '../validationError';
import { ValidationMessages } from '../validationMessages';

export async function checkIfUrlIsRegistered(
  uId: UrlId,
  storage: UrlStorage,
  logger: Logger
) {
  const url = await findUrl(uId);
  if (isNotFound(url)) throwDoesNotExistError();
  logChecking(uId.getId());

  function isNotFound(url: Url) {
    return !url;
  }

  async function findUrl(uId: UrlId) {
    return await storage.findById(uId.getId());
  }

  function throwDoesNotExistError() {
    throw new ValidationError(ValidationMessages.ID_DOES_NOT_EXIST);
  }

  function logChecking(id: string) {
    logger.logInfo(`Checked URL registration by id(${id})`);
  }
}

export async function findUrlById(
  uId: UrlId,
  urlStorage: UrlStorage,
  logger: Logger
) {
  const url = await urlStorage.findById(uId.getId());
  logFound(uId.getId(), url);
  return url;

  function logFound(id: string, url: Url) {
    logger.logInfo(`Found url using id(${id})`, url);
  }
}
