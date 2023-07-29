import { UrlId } from '../src/core/domain/urlId';
import { UrlStorage } from '../src/core/ports/urlStorage';

export async function assertSavedDeviceType(
  urlStorage: UrlStorage,
  id: string,
  deviceType: string
) {
  const deviceTypes = await urlStorage.getTopDeviceTypes(new UrlId(id));
  expect(deviceTypes.length).toBe(1);
  expect(deviceTypes[0].getType()).toBe(deviceType);
}
