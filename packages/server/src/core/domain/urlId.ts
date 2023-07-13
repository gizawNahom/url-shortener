import { ValidationError } from '../validationError';
import { ValidationMessages } from '../validationMessages';

export class UrlId {
  constructor(private id: string) {
    if (!id) throw this.buildValidationError(ValidationMessages.ID_REQUIRED);
    if (!this.isNineCharacterAlphaNumeric(id))
      throw this.buildValidationError(ValidationMessages.ID_INVALID);
  }

  private isNineCharacterAlphaNumeric(id: string) {
    return /^[a-zA-Z0-9]{9}$/.test(id);
  }

  private buildValidationError(message: string) {
    return new ValidationError(message);
  }

  getId(): string {
    return this.id;
  }
}
