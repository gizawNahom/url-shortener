import { ValidationError } from '../../src/core/validationError';
import { LoggerSpy } from './loggerSpy';

export const ID_REQUIRED = 'Id is required';
export const ID_INVALID = 'Id is invalid';
export const ID_DOES_NOT_EXIST = 'Id does not exist';
export const TABLET_DEVICE_TYPE = 'tablet';
export const URL_REGISTRATION_LOG_MESSAGE = 'Checked URL registration by id';

export async function assertValidationErrorWithMessage(
  task: () => unknown,
  message: string
) {
  await expect(task()).rejects.toThrowError(message);
  await expect(task()).rejects.toThrowError(ValidationError);
}

export function assertLogInfoCalls(
  loggerSpy: LoggerSpy,
  calls: (string | object)[][]
) {
  expect(getNumberOfLogInfoCalls()).toBe(calls.length);
  calls.forEach((e, i) => {
    expect(getLogInfoCall(i)).toEqual(e);
  });

  function getNumberOfLogInfoCalls(): number {
    return loggerSpy.logInfoCalls.length;
  }

  function getLogInfoCall(index: number): unknown[] {
    return loggerSpy.logInfoCalls[index];
  }
}

export function getTodayString() {
  return new Date().toISOString();
}

export function getDateString(date: Date) {
  return date.toISOString();
}

export const invalidIds: readonly [string, string][] = [
  ['longIdWith12', ID_INVALID],
  ['shortId', ID_INVALID],
  ['google*d2', ID_INVALID],
];

export function describeInvalidId(
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
      ['', ID_REQUIRED],
      [undefined, ID_REQUIRED],
      ['f+./_- 89', ID_INVALID],
      ...invalidIds,
    ];
  }
}
