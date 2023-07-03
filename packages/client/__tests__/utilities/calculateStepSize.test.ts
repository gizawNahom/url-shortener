import { calculateStepSize } from '@/utilities/chartUtilities';

test.each([
  [3, 1],
  [5, 5],
  [6, 5],
  [10, 10],
  [51, 10],
  [501, 100],
  [3000, 1000],
  [60000, 10000],
  [600000, 100000],
])('correct output', (totalClicks, stepSize) => {
  expect(calculateStepSize(totalClicks)).toBe(stepSize);
});
