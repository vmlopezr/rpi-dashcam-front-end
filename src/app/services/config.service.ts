import { Injectable } from '@angular/core';

@Injectable()
class ConfigService {
  private NodePort;
  private NodeAddress;
  private LiveStreamPort;
  setNodePort(port: number): void {
    this.NodePort = port;
  }
  setNodeAddress(address: string): void {
    this.NodeAddress = address;
  }
  setLiveStreamPort(port: number): void {
    this.LiveStreamPort = port;
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
}
export { ConfigService };
