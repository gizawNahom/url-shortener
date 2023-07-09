import { StatHeading } from '@/components/statHeading';
import userEvent from '@testing-library/user-event';
import { render, screen } from '__tests__/wrapper';
import { url } from 'mocks/values';

function renderSUT() {
  render(<StatHeading url={url} />);
}

function getCopyButton() {
  return getElementByRole('button', 'Copy');
}

function getElementByRole(role: string, title?: string) {
  return screen.getByRole(role, { name: title });
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

  const copyButton = getCopyButton();
  expect(copyButton).toBeVisible();
});

test('clicking copy button copies short url', async () => {
  renderSUT();

  userEvent.setup();
  await userEvent.click(getCopyButton());

  const clipText = await navigator.clipboard.readText();
  expect(clipText).toBe(url.shortUrl);
});
