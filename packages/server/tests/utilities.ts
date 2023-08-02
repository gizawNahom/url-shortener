import Context from '../src/adapter-restapi-express/context';
import { Click } from '../src/core/domain/click';
import { UrlId } from '../src/core/domain/urlId';
import { UrlStorage } from '../src/core/ports/urlStorage';

export async function assertSavedDeviceType(
  urlStorage: UrlStorage,
  id: string,
  deviceType: string
) {
  const deviceTypes = await urlStorage.getTop3DeviceTypes(new UrlId(id));
  expect(deviceTypes.length).toBe(1);
  expect(deviceTypes[0].getType()).toBe(deviceType);
}

export async function saveClick({
  id,
  clickDate = new Date(),
  deviceType = '',
}: {
  id: string;
  clickDate?: Date;
  deviceType?: string;
}) {
  await Context.urlStorage.saveClick(
    new Click(new UrlId(id), clickDate, deviceType)
  );
}
