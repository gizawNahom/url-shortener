import { mapToAxes } from '@/utilities/chartUtilities';

const day1 = '1/1/2001';
const day1InISO = '2000-12-31T21:00:00.000Z';
const totalClicksForDay1 = 1;

const coordinateForDay1 = {
  x: day1InISO,
  y: totalClicksForDay1,
};

test('returns empty array for empty input', () => {
  expect(mapToAxes([])).toEqual([]);
});

test('returns correct output for a daily count', () => {
  expect(mapToAxes([{ day: day1, totalClicks: totalClicksForDay1 }])).toEqual([
    coordinateForDay1,
  ]);
});

test('returns correct output for two daily counts', () => {
  const day2 = '2/2/2002';
  const totalClicks = 5;
  const day2InISO = '2002-02-01T21:00:00.000Z';
  const cord2 = { x: day2InISO, y: totalClicks };
  expect(
    mapToAxes([
      { day: day1, totalClicks: totalClicksForDay1 },
      { day: day2, totalClicks },
    ])
  ).toEqual([coordinateForDay1, cord2]);
});
