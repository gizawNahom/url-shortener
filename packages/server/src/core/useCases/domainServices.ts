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
