import userEvent from '@testing-library/user-event';
import { ShortenedUrlRow } from '@/components/shortenedUrlRow';
import { act, render, screen } from '../wrapper';
import {
  copyText,
  getElementByText,
  queryElementByText,
} from '__tests__/testUtils';
import { shortenedUrl, validId } from 'mocks/values';

const copiedText = /^copied/i;
const statLinkTitle = 'Charts Icon';

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

function renderSUT() {
  render(<ShortenedUrlRow shortenedUrl={shortenedUrl} />);
}

async function clickCopyButton() {
  await userEvent.click(getElementByText(copyText));
}

function assertCorrectLinkIsVisible() {
  const linkName = shortenedUrl.shortUrl.slice(8);
  const link = getLink(linkName);
  expect(link).toHaveAttribute('href', shortenedUrl.shortUrl);
  expect(link).toHaveAttribute('target', '_blank');
}

function getLink(name: string) {
  return screen.getByRole('link', { name });
}

async function assertClickingCopyButtonChangesText() {
  expect(queryElementByText(copiedText)).toBeNull();
  await clickCopyButton();
  expect(queryElementByText(copiedText)).not.toBeNull();
}

async function assertCopiedChangesToCopyAfter5secs() {
  expect(queryElementByText(copiedText)).not.toBeNull();
  expect(queryElementByText(copyText)).toBeNull();
  await act(() => new Promise((resolve) => setTimeout(resolve, 5000)));
  expect(queryElementByText(copiedText)).toBeNull();
  expect(queryElementByText(copyText)).not.toBeNull();
}

test('clicking shortened url opens the url in a new tab', async () => {
  renderSUT();

  assertCorrectLinkIsVisible();
});

test('clicking copy button makes it change its text to "Copied"', async () => {
  renderSUT();

  await assertClickingCopyButtonChangesText();
});

test('"Copied" button changes to "Copy" after 5 secs', async () => {
  renderSUT();

  await clickCopyButton();

  await assertCopiedChangesToCopyAfter5secs();
}, 10000);

test('displays charts icon', () => {
  renderSUT();

  expect(screen.getByTitle(statLinkTitle)).toBeInTheDocument();
});

test('displays charts icon link', () => {
  renderSUT();

  const link = getLink(statLinkTitle);
  expect(link).toBeVisible();
  expect(link).toHaveAttribute('href', `/stat/${validId}`);
});
