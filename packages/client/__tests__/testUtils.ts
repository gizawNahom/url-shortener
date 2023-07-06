import { server } from 'mocks/server';
import { screen, waitForElementToBeRemoved } from './wrapper';

export function setUpMSW() {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });
}

export function queryElementByRole(role: string) {
  return screen.queryByRole(role);
}

export function queryElementByText(text: string | RegExp): HTMLElement | null {
  return screen.queryByText(text);
}

export function getUrlInput(): HTMLElement {
  return screen.getByRole('textbox');
}

export function getElementByText(text: string | RegExp): HTMLElement {
  return screen.getByText(text);
}

export async function findElementByText(text: string): Promise<HTMLElement> {
  return await screen.findByText(text);
}

export function removeHTTPS(url: string) {
  return url.slice(8);
}

export async function assertLoadingTextIsDisplayedAndRemoved() {
  await waitForElementToBeRemoved(() => getElementByText(/loading/i));
}

export const copyText = /^copy/i;
