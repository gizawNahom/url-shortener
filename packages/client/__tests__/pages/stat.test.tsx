import 'jest-canvas-mock';

import { render, screen, waitFor } from '__tests__/wrapper';
import { idWith0Clicks, invalidId, url, validId } from 'mocks/values';
import Stat from 'pages/stat/[id]';
import {
  assertLoadingTextIsDisplayedAndRemoved,
  findElementByText,
  getElementByText,
  queryElementByText,
  removeHTTPS,
  setUpMSW,
} from '__tests__/testUtils';
import { useRouter } from 'next/router';

global.ResizeObserver = require('resize-observer-polyfill');

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const push = jest.fn();
const shortUrlWithOutProtocol = removeHTTPS(url.shortUrl);

function mockRouter(invalidId: string) {
  const router = useRouter as jest.Mock;
  router.mockImplementation(() => ({
    push: push,
    query: {
      id: invalidId,
    },
  }));
}

function renderSUT() {
  render(<Stat />);
}

function assertUrlsAndClickCountChartAreNotDisplayed() {
  expect(queryElementByText(shortUrlWithOutProtocol)).toBeNull();
  expect(queryElementByText(url.longUrl)).toBeNull();
  assertClickCountChartIsNotDisplayed();
}

function assertClickCountChartIsNotDisplayed() {
  expect(screen.queryByTestId('clickCount')).toBeNull();
}

function assertUrlsAndClickCountChartAreDisplayed() {
  expect(getElementByText(shortUrlWithOutProtocol)).toBeVisible();
  expect(getElementByText(url.longUrl)).toBeVisible();
  expect(screen.getByTestId('clickCount')).toBeVisible();
}

setUpMSW();

test('displays urls', async () => {
  mockRouter(validId);

  renderSUT();

  expect(await findElementByText(shortUrlWithOutProtocol)).toBeVisible();
  expect(getElementByText(url.longUrl)).toBeVisible();
});

test('displays loading while fetching', async () => {
  mockRouter(validId);

  renderSUT();

  assertUrlsAndClickCountChartAreNotDisplayed();
  await assertLoadingTextIsDisplayedAndRemoved();
  assertUrlsAndClickCountChartAreDisplayed();
});

test('redirects to home page if exception is thrown', async () => {
  mockRouter(invalidId);

  renderSUT();

  await waitFor(() => expect(push).toHaveBeenCalledWith('/'));
  expect(push).toHaveBeenCalledTimes(1);
});

test('displays appropriate text and placeholder chart if total clicks is zero', async () => {
  mockRouter(idWith0Clicks);

  renderSUT();

  expect(await findElementByText('There are no clicks yet')).toBeVisible();
  expect(screen.getByTitle('Placeholder Chart')).toBeInTheDocument();
  assertClickCountChartIsNotDisplayed();
});
