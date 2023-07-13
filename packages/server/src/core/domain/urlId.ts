import { ValidationError } from '../validationError';
import { ValidationMessages } from '../validationMessages';

export class UrlId {
  constructor(private id: string) {
    if (this.isFalsy(id)) this.throwIdRequiredError();
    if (!this.isNineCharacterAlphaNumeric(id)) this.throwIdInvalidError();
  }

  private isFalsy(id: string) {
    return !id;
  }

  private throwIdRequiredError() {
    throw this.buildValidationError(ValidationMessages.ID_REQUIRED);
  }

  private isNineCharacterAlphaNumeric(id: string) {
    return /^[a-zA-Z0-9]{9}$/.test(id);
  }

  private throwIdInvalidError() {
    throw this.buildValidationError(ValidationMessages.ID_INVALID);
  }

  private buildValidationError(message: string) {
    return new ValidationError(message);
  }

  getId(): string {
    return this.id;
  }
}
