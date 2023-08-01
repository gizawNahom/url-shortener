import { Url } from '../domain/url';
import { UrlId } from '../domain/urlId';
import { UrlStorage } from '../ports/urlStorage';
import { ValidationError } from '../validationError';
import { ValidationMessages } from '../validationMessages';

export async function checkIfUrlIsRegistered(storage: UrlStorage, uId: UrlId) {
  const url = await findUrl(uId);
  if (isNotFound(url)) throwDoesNotExistError();

  function isNotFound(url: Url) {
    return !url;
  }

  async function findUrl(uId: UrlId) {
    return await storage.findById(uId.getId());
  }

  function throwDoesNotExistError() {
    throw new ValidationError(ValidationMessages.ID_DOES_NOT_EXIST);
  }
}
