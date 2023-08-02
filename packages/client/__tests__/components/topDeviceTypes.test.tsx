import { TopDeviceTypes } from '@/components/topDeviceTypes';
import { DeviceTypePercentage } from '@/utilities/httpClient';
import {
  assertLoadingTextIsDisplayedAndRemoved,
  findElementByText,
  getElementByText,
  queryElementByText,
  setUpMSW,
} from '__tests__/testUtils';
import { render, screen } from '__tests__/wrapper';
import { topDeviceTypes, validId } from 'mocks/values';

const topDevicesText = /Top devices/i;

function renderSUT() {
  render(<TopDeviceTypes id={validId} />);
}

function assertAllListItemsAreInTheList(
  listItems: HTMLElement[],
  list: HTMLElement
) {
  listItems.forEach((listItem) => assertListItemIsInList(list, listItem));

  function assertListItemIsInList(list: HTMLElement, listItem: HTMLElement) {
    expect(list).toContainElement(listItem);
  }
}

function assertListContainsTopDeviceTypes(list: HTMLElement) {
  topDeviceTypes.forEach((deviceType) =>
    assertListContainsDeviceType(list, deviceType)
  );

  function assertListContainsDeviceType(
    list: HTMLElement,
    deviceTypePercentage: DeviceTypePercentage
  ) {
    expect(list).toHaveTextContent(deviceTypePercentage.type);
    expect(list).toHaveTextContent(deviceTypePercentage.percentage.toString());
  }
}

setUpMSW();

test('displays top devices text', async () => {
  renderSUT();

  expect(await findElementByText(topDevicesText)).toBeVisible();
});

test('displays top devices', async () => {
  renderSUT();

  const list = await screen.findByRole('list');
  const listItems = screen.getAllByRole('listitem');
  expect(list).toBeVisible();
  expect(listItems.length).toBe(3);
  assertAllListItemsAreInTheList(listItems, list);
  assertListContainsTopDeviceTypes(list);
});

test('displays loading', async () => {
  renderSUT();

  expect(queryElementByText(topDevicesText)).toBeNull();
  await assertLoadingTextIsDisplayedAndRemoved();
  expect(getElementByText(topDevicesText)).toBeVisible();
});