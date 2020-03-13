import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '../services/config.service';
import { StreamService } from '../services/streaming.service';
import { ModalController, IonApp } from '@ionic/angular';
import { LivestreamModal } from './Modals/livestream-modal';
import { Platform } from '@ionic/angular';
import { MSHD3000Data, CamData, DataService } from '../services/data.service';

@Component({
  selector: 'app-live-stream',
  templateUrl: './live-stream.page.html',
  styleUrls: ['./live-stream.page.scss'],
})
export class LiveStreamPage implements OnInit {
  // Back End Info
  Device: string;
  LiveStreamPort: number;

  imgSrc: string;
  socket: SocketIOClient.Socket;
  image: SafeUrl;
  platform: Platform;
  Camera: string;
  isRecording: boolean;
  constructor(
    private _platform: Platform,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private modalController: ModalController,
    private configService: ConfigService,
    private streamService: StreamService,
    private dataService: DataService,
  ) {
    const address = this.configService.getNodeAddress();
    const port = this.configService.getNodePort();
    this.LiveStreamPort = this.configService.getLiveStreamPort();
    this.isRecording = this.dataService.getIsRecording();
    this.Camera = this.dataService.getCamera();
    this.platform = _platform;

    this.Device = configService.getDevice();
    this.imgSrc = `http://${address}:${port}/videos/thumbnail/loading.jpg`;
    if (this.isRecording) {
      this.streamService.startSocket();
      this.socket = this.streamService.getSocket();
      this.startListener();
    }

    console.log('Live stream constructor running');
  }
  ngOnInit(): void {
    console.log('entered live stream page');
  }
  async OpenModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: LivestreamModal,
      cssClass: 'caminfo',
    });
    modal.onDidDismiss().then(dataReturned => {
      console.log('Closed Modal');
    });
    return modal.present();
  }
  backHandler(): void {
    if (this.isRecording) {
      const address = this.configService.getNodeAddress();
      const port = this.configService.getNodePort();
      // Stop the TCP camera feed on the python application
      this.http.get(`http://${address}:${port}/livestream/stop`).subscribe();
      // cleanup socket
      console.log('back to home page');
      this.socket.off('image', this.updateImage);
      // this.socket.destroy();
      this.socket.close();
      this.streamService.stopSocket();
    }
    console.log('Leaving Streaming Page');
    // this.streamService.saveData(this.camData);
  }
  saveData(data: CamData): void {
    this.dataService.setCamData(data);
  }
  startListener(): void {
    this.socket.on('image', this.updateImage);
  }
  updateImage = (data): void => {
    this.imgSrc = 'data:image/jpeg;base64, ' + data.toString('base64');
  };
  getImgContent(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.imgSrc);
  }
  isLogitechC920(): boolean {
    return this.Camera === 'Logitech Webcam HD C920';
  }
  isMSHD3000(): boolean {
    return this.Camera === 'Microsoft LifeCam HD-3000';
  }
  isDefaultCam(): boolean {
    return (
      this.Camera !== 'Logitech Webcam HD C920' &&
      this.Camera !== 'Microsoft LifeCam HD-3000'
    );
  }
  sendVideoLength(event): void {
    const socketdata = 'newtime ' + event;
    const address = this.configService.getNodeAddress();
    const port = this.configService.getNodePort();
    if (this.isRecording) {
      this.http
        .post(`http://${address}:${port}/livestream/VidLength`, {
          camSettings: socketdata,
        })
        .subscribe();
    }
    console.log('data updated');
  }
  rotateStream(): void {
    const port = this.configService.getNodePort();
    const address = this.configService.getNodeAddress();
    if (this.isRecording) {
      this.http.get(`http://${address}:${port}/livestream/rotate`).subscribe();
    }
  }

  sendCameraSettings(event: string): void {
    const address = this.configService.getNodeAddress();
    const port = this.configService.getNodePort();
    console.log(event);
    if (this.isRecording) {
      this.http
        .post(`http://${address}:${port}/livestream/CamSettings`, {
          camSettings: event,
        })
        .subscribe();
    }
  }
}
