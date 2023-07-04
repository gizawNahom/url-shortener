import { ValidationError } from '../../src/core/validationError';

export const ID_REQUIRED = 'Id is required';
export const ID_INVALID = 'Id is invalid';
export const ID_DOES_NOT_EXIST = 'Id does not exist';

export async function assertValidationErrorWithMessage(
  task: () => unknown,
  message: string
) {
  await expect(task()).rejects.toThrowError(message);
  await expect(task()).rejects.toThrowError(ValidationError);
}

export function getTodayString() {
  return new Date().toISOString();
}

export function getDateString(date: Date) {
  return date.toISOString();
}
