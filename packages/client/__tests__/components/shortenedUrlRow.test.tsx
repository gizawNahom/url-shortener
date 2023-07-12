import { ShortenedUrlRow } from '@/components/shortenedUrlRow';
import { render, screen } from '../wrapper';
import { getElementByRole } from '__tests__/testUtils';
import { shortenedUrl, validId } from 'mocks/values';

const statLinkTitle = 'Charts Icon';

function renderSUT() {
  render(<ShortenedUrlRow shortenedUrl={shortenedUrl} />);
}

function assertCorrectLinkIsVisible() {
  const linkName = shortenedUrl.shortUrl.slice(8);
  const link = getLink(linkName);
  expect(link).toHaveAttribute('href', shortenedUrl.shortUrl);
  expect(link).toHaveAttribute('target', '_blank');
}

function getLink(name: string) {
  return getElementByRole('link', name);
}

test('clicking shortened url opens the url in a new tab', async () => {
  renderSUT();

  assertCorrectLinkIsVisible();
});

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
