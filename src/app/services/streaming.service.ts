import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import * as io from 'socket.io-client';
import { CamData } from '../live-stream/live-stream.page';

@Injectable()
class StreamService {
  private socket;
  private camData: CamData;
  constructor(private configService: ConfigService) {
    console.log('stream service construtor running');
    this.socket = null;
    this.camData = this.dataDefaults();
  }
  dataDefaults(): CamData {
    return {
      brightness: 128,
      contrast: 128,
      saturation: 128,
      gain: 0,
      whiteBalanceTemp: 4000,
      sharpness: 128,
      exposureAbsolute: 250,
      panAbsolute: 0,
      tiltAbsolute: 0,
      focusAbsolute: 0,
      zoomAbsolute: 100,
      powerFreq: 2,
      whiteBalanceAuto: true,
      exposureAuto: true,
      exposureAutoPriority: false,
      focusAuto: true,
      backlightComp: true,
    };
  }
  saveData(_camData: CamData): void {
    this.camData = _camData;
  }
  getData(): CamData {
    return this.camData;
  }
  getSocket(): io.Socket {
    return this.socket;
  }
  startSocket(): void {
    const nodeAddress = this.configService.getNodeAddress();
    const liveStreamPort = this.configService.getLiveStreamPort();
    if (!this.socket) {
      this.socket = io.connect(`http://${nodeAddress}:${liveStreamPort}`);
    }
  }
  stopSocket(): void {
    this.socket.destroy();
    this.socket = null;
  }
}
export { StreamService };
