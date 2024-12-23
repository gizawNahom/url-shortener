import { render, screen, waitFor } from '../wrapper';
import userEvent from '@testing-library/user-event';
import {
  copyText,
  clickCopyButton,
  getElementByText,
  getUrlInput,
  queryElementByRole,
  queryElementByText,
  removeHTTPS,
  assertClipBoardContainsText,
  clickElement,
} from '__tests__/testUtils';
import { longUrl, shortenedUrl } from 'mocks/values';
import Index from 'pages';

const mockShortenUrl = jest.fn();
jest.mock('@/utilities/httpClient', () => {
  return {
    shortenUrl: (longUrl: string) => mockShortenUrl(longUrl),
  };
});

const shortenButtonText = /^shorten/i;
const validUrl = longUrl;
const invalidUrl = 'invalid url';
const response = shortenedUrl;

function setRequestResponse() {
  mockShortenUrl.mockResolvedValue(response);
}

function renderSUT() {
  render(<Index />);
}

function getList(): HTMLElement | null {
  return queryElementByRole('list');
}

async function typeValidUrlAndClickShorten() {
  await typeUrlAndClickShorten(validUrl);
}

async function typeInvalidUrlAndClickShorten() {
  await typeUrlAndClickShorten(invalidUrl);
}

async function typeUrlAndClickShorten(url: string) {
  await typeUrlIntoInput(url);
  await clickShortenButton();
}

async function clickShortenButton() {
  await clickElement(getElementByText(shortenButtonText));
}

async function typeUrlIntoInput(validUrl: string) {
  await userEvent.type(getUrlInput(), validUrl);
}

function assertHeadingWithText(text: string) {
  const heading = queryElementByRole('heading');
  expect(heading).toBeVisible();
  expect(heading).toHaveTextContent(text);
}

function assertShortenUrlRequestWasNotSent() {
  assertShortenUrlRequestTimes(0);
}

function assertShortenUrlRequestTimes(times: number) {
  expect(mockShortenUrl).toBeCalledTimes(times);
}

function assertAListItemIsInsideAList() {
  const listItems = screen.queryAllByRole('listitem');
  expect(listItems.length).toBe(1);
  const fLItem = listItems[0];
  expect(fLItem).toBeVisible();
  expect(getList()).toContainElement(fLItem);
}

function assertListItemContainsUrlWithoutProtocol(url: string) {
  const listItem = queryElementByRole('listitem');
  const urlWithNoProtocol = removeHTTPS(url);
  expect(listItem).toHaveTextContent(urlWithNoProtocol);
  expect(listItem).not.toHaveTextContent(url);
}

async function assertCopyButtonIsDisplayed() {
  await waitFor(() => {
    expect(getElementByText(copyText)).toBeInTheDocument();
  });
}

function assertInvalidLinkTextIsNotDisplayed() {
  expect(queryElementByText('Invalid Link')).not.toBeInTheDocument();
}

async function assertClipBoardContainsShortUrl() {
  await assertClipBoardContainsText(response.shortUrl);
}

describe('Index', () => {
  test('heading is displayed', () => {
    renderSUT();

    assertHeadingWithText('Create Short Links');
  });

  test('valid url triggers a request', async () => {
    renderSUT();

    await typeValidUrlAndClickShorten();

    assertShortenUrlRequestTimes(1);
    expect(mockShortenUrl).toBeCalledWith(validUrl);
  });

  test('empty url does not trigger a request', async () => {
    renderSUT();

    await clickShortenButton();

    assertShortenUrlRequestWasNotSent();
  });

  test('"Link is required" text appears if the requested url is empty', async () => {
    renderSUT();

    await clickShortenButton();

    await waitFor(() => {
      expect(queryElementByText('Link is required')).toBeVisible();
    });
  });

  test('"Invalid Link" text appears if url is invalid', async () => {
    renderSUT();

    await typeInvalidUrlAndClickShorten();

    expect(queryElementByText('Invalid Link')).toBeVisible();
  });

  test('"Invalid Link" text is not found at the beginning', () => {
    renderSUT();

    assertInvalidLinkTextIsNotDisplayed();
  });

  test('invalid url does not trigger a request', async () => {
    renderSUT();

    await typeInvalidUrlAndClickShorten();

    assertShortenUrlRequestWasNotSent();
  });

  test('no list exists before a successful request', () => {
    renderSUT();

    expect(getList()).not.toBeInTheDocument();
  });

  test('state after a successful request', async () => {
    setRequestResponse();
    renderSUT();

    await typeValidUrlAndClickShorten();

    expect(getUrlInput()).toHaveValue('');
    assertInvalidLinkTextIsNotDisplayed();
    expect(getList()).toBeVisible();
    assertAListItemIsInsideAList();
    assertListItemContainsUrlWithoutProtocol(response.longUrl);
    assertListItemContainsUrlWithoutProtocol(response.shortUrl);
    await assertCopyButtonIsDisplayed();
  });

  test('clicking the copy button copies short url', async () => {
    setRequestResponse();
    renderSUT();
    await typeValidUrlAndClickShorten();

    await clickCopyButton(getElementByText(copyText));

    await assertClipBoardContainsShortUrl();
  });

  test('clicking enter sends request', async () => {
    renderSUT();

    await typeUrlIntoInput(validUrl);
    await userEvent.keyboard('{enter}');

    assertShortenUrlRequestTimes(1);
    expect(mockShortenUrl).toBeCalledWith(validUrl);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
