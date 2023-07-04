import { subtractDays } from '@/utilities/chartUtilities';

const ISODate = '2000-12-31T21:00:00.000Z';

test.each([0, -1])(
  'returns ISO string of the given date if days is less than or equal to zero',
  (days) => {
    expect(subtractDays(ISODate, days)).toBe(ISODate);
  }
);

test('returns days minus the give date', () => {
  expect(subtractDays(ISODate, 10)).toBe('2000-12-21T21:00:00.000Z');
});
