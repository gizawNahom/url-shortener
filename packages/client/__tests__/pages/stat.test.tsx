import 'jest-canvas-mock';

import { render, screen, waitFor } from '__tests__/wrapper';
import { invalidId, url, validId } from 'mocks/values';
import Stat from 'pages/stat/[id]';
import {
  assertLoadingTextIsDisplayedAndRemoved,
  findElementByText,
  getElementByText,
  queryElementByText,
  setUpMSW,
} from '__tests__/testUtils';
import { useRouter } from 'next/router';

global.ResizeObserver = require('resize-observer-polyfill');

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const push = jest.fn();

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
  expect(queryElementByText(url.shortUrl)).toBeNull();
  expect(queryElementByText(url.longUrl)).toBeNull();
  expect(screen.queryByTestId('clickCount')).toBeNull();
}

function assertUrlsAndClickCountChartAreDisplayed() {
  expect(getElementByText(url.shortUrl)).toBeVisible();
  expect(getElementByText(url.longUrl)).toBeVisible();
  expect(screen.getByTestId('clickCount')).toBeVisible();
}

setUpMSW();

test('displays urls', async () => {
  mockRouter(validId);

  renderSUT();

  expect(await findElementByText(url.shortUrl)).toBeVisible();
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
