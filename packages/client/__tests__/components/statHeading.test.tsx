import { StatHeading } from '@/components/statHeading';
import {
  assertClipBoardContainsText,
  clickCopyButton,
  getElementByRole,
} from '__tests__/testUtils';
import { render, screen } from '__tests__/wrapper';
import { url } from 'mocks/values';

function renderSUT() {
  render(<StatHeading url={url} />);
}

async function findCopyButton(): Promise<HTMLElement> {
  return await screen.findByRole('button', { name: 'Copy' });
}

function assertLinkThatOpenANewTabIsDisplayed() {
  const link = getElementByRole('link', 'Visit URL');
  expect(link).toBeVisible();
  expect(link).toHaveAttribute('href', url.shortUrl);
  expect(link).toHaveAttribute('target', '_blank');
}

test('displays copy button and visit url', async () => {
  renderSUT();

  expect(await findCopyButton()).toBeVisible();
  assertLinkThatOpenANewTabIsDisplayed();
});

test('clicking copy button copies short url', async () => {
  renderSUT();

  await clickCopyButton(await findCopyButton());

  await assertClipBoardContainsText(url.shortUrl);
});
