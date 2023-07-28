import { DeviceTypePercentage } from '../domain/deviceTypePercentage';
import { UrlId } from '../domain/urlId';
import { UrlStorage } from '../ports/urlStorage';
import { ValidationError } from '../validationError';
import { ValidationMessages } from '../validationMessages';

export class GetTopDeviceTypesUseCase {
  constructor(private urlStorage: UrlStorage) {}

  async getTopDevices(id: string): Promise<GetTopDevicesUseCaseResponse> {
    const uId = new UrlId(id);
    await this.checkIfUrlWasSaved(uId);
    const devices = await this.getTopDeviceTypes(uId);
    return this.buildResponse(devices);
  }

  private async checkIfUrlWasSaved(uId: UrlId) {
    const url = await this.urlStorage.findById(uId.getId());
    if (!url) throw new ValidationError(ValidationMessages.ID_DOES_NOT_EXIST);
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
