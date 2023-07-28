export class DeviceTypePercentage {
  constructor(private type: string, private percentage: number) {}

  getType(): string {
    return this.type;
  }

  getPercentage(): number {
    return this.percentage;
  }
}
