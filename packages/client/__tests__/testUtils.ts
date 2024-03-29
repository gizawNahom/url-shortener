import { server } from 'mocks/server';
import { screen, waitForElementToBeRemoved } from './wrapper';
import userEvent from '@testing-library/user-event';

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
  return getElementByRole('textbox');
}

export function getElementByText(text: string | RegExp): HTMLElement {
  return screen.getByText(text);
}

export function getElementByRole(role: string, title?: string) {
  return screen.getByRole(role, { name: title });
}

export async function findElementByText(
  text: string | RegExp
): Promise<HTMLElement> {
  return await screen.findByText(text);
}

export async function clickCopyButton(button: HTMLElement) {
  userEvent.setup();
  await clickElement(button);
}

export async function clickElement(element: HTMLElement) {
  await userEvent.click(element);
}

export function removeHTTPS(url: string) {
  return url.slice(8);
}

export async function assertLoadingTextIsDisplayedAndRemoved() {
  await waitForElementToBeRemoved(() => getElementByText(/loading/i));
}

export async function assertClipBoardContainsText(text: string) {
  const clipText = await navigator.clipboard.readText();
  expect(clipText).toBe(text);
}

export const copyText = /^copy/i;
export const topDevicesText = /Top devices/i;
