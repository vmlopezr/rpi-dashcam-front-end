import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import * as io from 'socket.io-client';

@Injectable()
class StreamService {
  private socket: SocketIOClient.Socket;
  constructor(private configService: ConfigService) {
    console.log('stream service construtor running');
    this.socket = null;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getSocket(): SocketIOClient.Socket {
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
    // this.socket.destroy();
    this.socket.close();
    this.socket = null;
  }
}
export { StreamService };
