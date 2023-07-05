import 'jest-canvas-mock';

import { render, screen } from '__tests__/wrapper';
import { url } from 'mocks/values';
import mockRouter from 'next-router-mock';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';
import Stat from 'pages/stat/[id]';
import {
  assertLoadingTextIsDisplayedAndRemoved,
  getElementByText,
  queryElementByText,
} from '__tests__/testUtils';

global.ResizeObserver = require('resize-observer-polyfill');

jest.mock('next/router', () => require('next-router-mock'));
mockRouter.useParser(createDynamicRouteParser(['/stat/[id]']));

function goToPage() {
  const validId = 'googleId1';
  mockRouter.push(`/stat/${validId}`);
}

function renderSUT() {
  render(<Stat />);
}

async function findElementByText(text: string): Promise<HTMLElement> {
  return await screen.findByText(text);
}

function assertUrlsAndClickCountChartAreNotDisplayed() {
  expect(queryElementByText(url.shortUrl)).toBeNull();
  expect(queryElementByText(url.longUrl)).toBeNull();
  expect(screen.queryByTestId('clickCount')).toBeNull();
}

function assertUrlsAndClickCountChartAreDisplayed() {
  expect(getElementByText(url.shortUrl)).toBeVisible();
  expect(getElementByText(url.longUrl)).toBeVisible();
  expect(screen.getByTestId('clickCount')).toBeVisible();
}

test('displays urls', async () => {
  goToPage();

  renderSUT();

  expect(await findElementByText(url.shortUrl)).toBeVisible();
  expect(getElementByText(url.longUrl)).toBeVisible();
});

test('displays loading while fetching', async () => {
  goToPage();

  renderSUT();

  assertUrlsAndClickCountChartAreNotDisplayed();
  await assertLoadingTextIsDisplayedAndRemoved();
  assertUrlsAndClickCountChartAreDisplayed();
});
