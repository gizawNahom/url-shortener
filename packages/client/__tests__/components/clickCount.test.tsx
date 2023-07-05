import 'jest-canvas-mock';

import { ClickCount } from '@/components/clickCount';
import { render } from '__tests__/wrapper';
import { totalClicksByDay } from 'mocks/values';
import {
  assertLoadingTextIsDisplayedAndRemoved,
  findElementByText,
  getElementByText,
  queryElementByText,
  setUpMSW,
} from '__tests__/testUtils';

global.ResizeObserver = require('resize-observer-polyfill');

const validId = 'googleId1';
const totalClicksText = 'Total Clicks';

function renderSUT() {
  render(<ClickCount id={validId} />);
}

function assertTotalClicksCountIsDisplayed() {
  expect(getElementByText(`${totalClicksByDay.totalClicks}`)).toBeVisible();
}

function assertTotalClicksTextIsNotFound() {
  expect(queryElementByText(totalClicksText)).toBeNull();
}

function assertTotalClicksTextIsDisplayed() {
  expect(getElementByText(totalClicksText)).toBeVisible();
}

setUpMSW();

test('displays total clicks', async () => {
  renderSUT();

  expect(await findElementByText(totalClicksText)).toBeVisible();
  assertTotalClicksCountIsDisplayed();
});

test('displays loading while fetching', async () => {
  renderSUT();

  assertTotalClicksTextIsNotFound();
  await assertLoadingTextIsDisplayedAndRemoved();
  assertTotalClicksTextIsDisplayed();
});
