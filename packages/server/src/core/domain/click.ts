import { UrlId } from './urlId';

export class Click {
  constructor(
    private id: UrlId,
    private timestamp: Date,
    private deviceType: string
  ) {}

  getId() {
    return this.id.getId();
  }

  getTimestamp() {
    return this.timestamp;
  }

  getDeviceType() {
    return this.deviceType;
  }
}
