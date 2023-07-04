import { DailyClickCount } from './httpClient';

export function calculateStepSize(totalClicks: number) {
  if (isLessThan5(totalClicks)) return 1;
  else if (isInClosed5And10Open(totalClicks)) return 5;
  else return getPowerOfTen();

  function isLessThan5(totalClicks: number) {
    return totalClicks < 5;
  }

  function isInClosed5And10Open(totalClicks: number) {
    return totalClicks >= 5 && totalClicks < 10;
  }

  function getPowerOfTen() {
    return 10 ** getExponent();
  }

  function getExponent() {
    return getNumberOfDigits(totalClicks) - 1;
  }

  function getNumberOfDigits(totalClicks: number) {
    return `${totalClicks}`.length;
  }
}

export function mapToAxes(dailyClickCounts: Array<DailyClickCount>) {
  return dailyClickCounts.map((dailyClickCount) => {
    return {
      x: dailyClickCount.day,
      y: dailyClickCount.totalClicks,
    };
  });
}

export function subtractDays(dateString: string, days: number) {
  const date = new Date(dateString);
  if (isDaysGreaterThan0()) subtractDaysFromDate();
  return date.toISOString();

  function isDaysGreaterThan0() {
    return days > 0;
  }

  function subtractDaysFromDate() {
    date.setDate(date.getDate() - days);
  }
}
