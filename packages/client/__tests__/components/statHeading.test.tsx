import { StatHeading } from '@/components/statHeading';
import userEvent from '@testing-library/user-event';
import { getElementByRole } from '__tests__/testUtils';
import { render } from '__tests__/wrapper';
import { url } from 'mocks/values';

function renderSUT() {
  render(<StatHeading url={url} />);
}

function getCopyButton() {
  return getElementByRole('button', 'Copy');
}

test('displays visit url link that opens a new tab', () => {
  renderSUT();

  const link = getElementByRole('link', 'Visit URL');
  expect(link).toBeVisible();
  expect(link).toHaveAttribute('href', url.shortUrl);
  expect(link).toHaveAttribute('target', '_blank');
});

test('displays copy button', () => {
  renderSUT();

  expect(getCopyButton()).toBeVisible();
});

test('clicking copy button copies short url', async () => {
  renderSUT();

  userEvent.setup();
  await userEvent.click(getCopyButton());

  const clipText = await navigator.clipboard.readText();
  expect(clipText).toBe(url.shortUrl);
});
