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
    const dateParts = getDateParts(dailyClickCount.day);
    const date = buildDate(dateParts);
    return buildCoordinate(date, dailyClickCount);
  });

  function buildCoordinate(
    date: Date,
    dCC: DailyClickCount
  ): { x: string; y: number } {
    return {
      x: date.toISOString(),
      y: dCC.totalClicks,
    };
  }
}

export function subtractDays(dateString: string, days: number) {
  const dateParts = getDateParts(dateString);
  const date = getDate();
  return date.toISOString();

  function getDate() {
    const date = buildDate(dateParts);
    if (isDaysGreaterThan0()) subtractDaysFromDate();
    return date;

    function isDaysGreaterThan0() {
      return days > 0;
    }

    function subtractDaysFromDate() {
      date.setDate(date.getDate() - days);
    }
  }
}

function getDateParts(day: string) {
  return day.split('/');
}

function buildDate(dateParts: string[]) {
  return new Date(parseYear(), parseMonthIndex(), parseDay());

  function parseYear(): number {
    return parseInt(dateParts[2]);
  }

  function parseMonthIndex(): number {
    return parseInt(dateParts[1]) - 1;
  }

  function parseDay(): number | undefined {
    return parseInt(dateParts[0]);
  }
}
