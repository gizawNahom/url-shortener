import { ValidationError } from '../../src/core/validationError';

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
