import { TopDeviceTypes } from '@/components/topDeviceTypes';
import { DeviceTypePercentage } from '@/utilities/httpClient';
import {
  assertLoadingTextIsDisplayedAndRemoved,
  findElementByText,
  getElementByText,
  queryElementByText,
  setUpMSW,
  topDevicesText,
} from '__tests__/testUtils';
import { render, screen } from '__tests__/wrapper';
import {
  formattedTopDeviceTypePercentages,
  topDeviceTypes,
  validId,
} from 'mocks/values';

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
  topDeviceTypes.forEach((deviceType, i) =>
    assertListContainsDeviceType(list, deviceType, i)
  );

  function assertListContainsDeviceType(
    list: HTMLElement,
    deviceTypePercentage: DeviceTypePercentage,
    index: number
  ) {
    expect(list).toHaveTextContent(deviceTypePercentage.type);
    expect(list).toHaveTextContent(formattedTopDeviceTypePercentages[index]);
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
