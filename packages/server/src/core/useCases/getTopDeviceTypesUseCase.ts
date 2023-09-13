import { DeviceTypePercentage } from '../domain/deviceTypePercentage';
import { UrlId } from '../domain/urlId';
import { Logger } from '../ports/logger';
import { UrlStorage } from '../ports/urlStorage';
import { checkIfUrlIsRegistered } from './domainServices';

export class GetTopDeviceTypesUseCase {
  constructor(private urlStorage: UrlStorage, private logger: Logger) {}

  async getTopDevices(id: string): Promise<GetTopDevicesUseCaseResponse> {
    const uId = this.buildUrlId(id);
    await checkIfUrlIsRegistered(uId, this.urlStorage, this.logger);
    const devices = await this.fetchTop3DeviceTypes(uId);
    this.logFetching(id);
    return this.buildResponse(devices);
  }

  private buildUrlId(id: string) {
    return new UrlId(id);
  }

  private fetchTop3DeviceTypes(uId: UrlId) {
    return this.urlStorage.getTop3DeviceTypes(uId);
  }

  private logFetching(id: string) {
    this.logger.logInfo(`Fetched top 3 device types using id(${id})`);
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
