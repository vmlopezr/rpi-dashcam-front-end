import { Injectable } from '@angular/core';

@Injectable()
class ConfigService {
  private NodePort: number;
  private NodeAddress: string;
  private LiveStreamPort: number;
  private Device: string;
  setNodePort(port: number): void {
    this.NodePort = port;
  }
  setNodeAddress(address: string): void {
    this.NodeAddress = address;
  }
  setLiveStreamPort(port: number): void {
    this.LiveStreamPort = port;
  }
  setDevice(device: string): void {
    this.Device = device;
  }
  getNodePort(): number {
    return this.NodePort;
  }
  getNodeAddress(): string {
    return this.NodeAddress;
  }
  getLiveStreamPort(): number {
    return this.LiveStreamPort;
  }
  getDevice(): string {
    return this.Device;
  }
}
export { ConfigService };
