import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';
import { DataService } from '../services/data.service';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-live-stream',
  templateUrl: './live-stream.page.html',
  styleUrls: ['./live-stream.page.scss'],
})
export class LiveStreamPage implements OnInit {
  imgSrc: string;
  socket: SocketIOClient.Socket;
  isRecording: boolean;
  showSpinner: boolean;
  constructor(
    private _platform: Platform,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private dataService: DataService,
  ) {}
  ngOnInit(): void {
    this.socket = null;
    this.showSpinner = true;
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    this.isRecording = this.dataService.getIsRecording();
    console.log(this.isRecording);
    this.imgSrc = `http://${IPAddress}:${NodePort}/videos/thumbnail/loading.jpg`;
    if (this.isRecording) {
      this.startSocket();
    }
  }
  startSocket(): void {
    const { IPAddress, LiveStreamPort } = this.dataService.getConfigData();
    if (!this.socket) {
      this.socket = io.connect(`http://${IPAddress}:${LiveStreamPort}`);
      this.startListener();
    }
  }
  startListener(): void {
    this.socket.on('image', this.updateImage);
  }

  isPortrait(): boolean {
    if (this._platform.platforms().includes('desktop')) {
      return true;
    } else {
      return this._platform.isPortrait();
    }
  }
  backHandler(): void {
    if (this.isRecording) {
      this.cleanUpSocket();
    }
    this.dataService.updateCameraDataDB();
  }
  cleanUpSocket(): void {
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    // Stop the TCP camera feed on the python application
    this.http
      .get(`http://${IPAddress}:${NodePort}/livestream/stop`)
      .subscribe();

    // cleanup socket
    this.socket.off('image', this.updateImage);
    this.socket.close();
    this.socket = null;
  }

  updateImage = (data): void => {
    this.imgSrc = 'data:image/jpeg;base64, ' + data.toString('base64');
    if (this.showSpinner) {
      this.showSpinner = false;
    }
  };
  getImgContent(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.imgSrc);
  }
  isLogitechC920(): boolean {
    return this.dataService.getCamera() === 'Logitech Webcam HD C920';
  }
  isMSHD3000(): boolean {
    return this.dataService.getCamera() === 'Microsoft LifeCam HD-3000';
  }
  isDefaultCam(): boolean {
    return (
      this.dataService.getCamera() !== 'Logitech Webcam HD C920' &&
      this.dataService.getCamera() !== 'Microsoft LifeCam HD-3000'
    );
  }
  sendVideoLength(event: string): void {
    const socketdata = 'newtime ' + event;
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    if (this.isRecording) {
      this.http
        .post(`http://${IPAddress}:${NodePort}/livestream/VidLength`, {
          camSettings: socketdata,
        })
        .subscribe();
    }
  }
  rotateStream(event: string): void {
    console.log('received verticalFlip: ' + event);
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    if (this.isRecording) {
      this.http
        .get(`http://${IPAddress}:${NodePort}/livestream/rotate`)
        .subscribe();
    }
  }

  sendCameraSettings(event: string): void {
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    console.log(event);
    if (this.isRecording) {
      this.http
        .post(`http://${IPAddress}:${NodePort}/livestream/CamSettings`, {
          camSettings: event,
        })
        .subscribe();
    }
  }
}
