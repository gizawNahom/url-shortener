import 'jest-canvas-mock';

import { ClickCount } from '@/components/clickCount';
import { render, screen, waitForElementToBeRemoved } from '__tests__/wrapper';
import { totalClicksByDay } from 'mocks/values';
import { queryElementByText } from '__tests__/testUtils';

global.ResizeObserver = require('resize-observer-polyfill');

const validId = 'googleId1';
const totalClicksText = 'Total Clicks';

function renderSUT() {
  render(<ClickCount id={validId} />);
}

function getElementByText(text: string | RegExp): HTMLElement {
  return screen.getByText(text);
}

function assertTotalClicksCountIsDisplayed() {
  expect(getElementByText(`${totalClicksByDay.totalClicks}`)).toBeVisible();
}

function assertTotalClicksTextIsNotFound() {
  expect(queryElementByText(totalClicksText)).toBeNull();
}

async function assertLoadingTextIsDisplayedAndRemoved() {
  await waitForElementToBeRemoved(() => getElementByText(/loading/i));
}

function assertTotalClicksTextIsDisplayed() {
  expect(getElementByText(totalClicksText)).toBeVisible();
}

test('displays total clicks', async () => {
  renderSUT();

  expect(await screen.findByText(totalClicksText)).toBeVisible();
  assertTotalClicksCountIsDisplayed();
});

test('displays loading while fetching', async () => {
  renderSUT();

  assertTotalClicksTextIsNotFound();
  await assertLoadingTextIsDisplayedAndRemoved();
  assertTotalClicksTextIsDisplayed();
});
