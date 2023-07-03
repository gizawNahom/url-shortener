import 'jest-canvas-mock';

import { ClickCount } from '@/components/clickCount';
import { render, screen, waitForElementToBeRemoved } from '__tests__/wrapper';
import { totalClicksByDay } from 'mocks/values';

global.ResizeObserver = require('resize-observer-polyfill');

const validId = 'googleId1';
const totalClicksText = 'Total Clicks';

function renderSUT() {
  render(<ClickCount id={validId} />);
}

function getElementByText(text: string | RegExp): HTMLElement {
  return screen.getByText(text);
}

test('displays total clicks', async () => {
  renderSUT();

  expect(await screen.findByText(totalClicksText)).toBeVisible();
  expect(getElementByText(`${totalClicksByDay.totalClicks}`)).toBeVisible();
});

test('displays loading while fetching', async () => {
  renderSUT();

  expect(screen.queryByText(totalClicksText)).toBeNull();
  await waitForElementToBeRemoved(() => getElementByText(/loading/i));
  expect(getElementByText(totalClicksText)).toBeVisible();
});
