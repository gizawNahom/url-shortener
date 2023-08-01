import { DeviceTypePercentage } from '../domain/deviceTypePercentage';
import { UrlId } from '../domain/urlId';
import { UrlStorage } from '../ports/urlStorage';
import { checkIfUrlIsRegistered } from './domainServices';

export class GetTopDeviceTypesUseCase {
  constructor(private urlStorage: UrlStorage) {}

  async getTopDevices(id: string): Promise<GetTopDevicesUseCaseResponse> {
    const uId = this.buildUrlId(id);
    await checkIfUrlIsRegistered(this.urlStorage, uId);
    const devices = await this.getTopDeviceTypes(uId);
    return this.buildResponse(devices);
  }

  private buildUrlId(id: string) {
    return new UrlId(id);
  }

  private getTopDeviceTypes(uId: UrlId) {
    return this.urlStorage.getTopDeviceTypes(uId);
  }

  private buildResponse(
    devices: DeviceTypePercentage[]
  ): GetTopDevicesUseCaseResponse | PromiseLike<GetTopDevicesUseCaseResponse> {
    return { devices: devices };
  }
}

export interface GetTopDevicesUseCaseResponse {
  devices: Array<DeviceTypePercentage>;
}
