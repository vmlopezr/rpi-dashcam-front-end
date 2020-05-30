import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { AlertController } from '@ionic/angular';
import * as io from 'socket.io-client';
// Update needed: If accessed directly by url show default image and give message,
// to enter from the home screen.
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
  timeout: NodeJS.Timer;
  disconnected: boolean;
  constructor(
    private _platform: Platform,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private dataService: DataService,
    private alertController: AlertController,
  ) {}
  ngOnInit(): void {
    this.socket = null;
    this.disconnected = false;
    this.showSpinner = true;
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    this.isRecording = this.dataService.getIsRecording();
    this.imgSrc = `http://${IPAddress}:${NodePort}/videos/thumbnail/loading.jpg`;
    // Allow time for the python script to create and stream the camera feed
    if (this.isRecording) {
      this.timeout = setTimeout(() => {
        this.startSocket();
        this.showSpinner = false;
        this.timeout = null;
      }, 2000);
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
    this.socket.on('error', err => {
      console.log(err);
    });
    this.socket.on('connect_error', () => {
      console.log('connect error');
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      this.presentAlert();
      this.disconnected = true;
      this.cleanUpSocket();
    });
  }
  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Server closed',
      message:
        'An error occurred with the recording process. \nVerify the camera is the correct one as chosen on the home screen.',
      buttons: ['OK'],
    });

    await alert.present();
  }
  isPortrait(): boolean {
    if (this._platform.platforms().includes('desktop')) {
      return true;
    } else {
      return this._platform.isPortrait();
    }
  }
  backHandler(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    if (this.isRecording) {
      this.cleanUpSocket();
    }
    this.dataService.updateCameraDataDB();
  }
  cleanUpSocket(): void {
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    if (!this.disconnected) {
      // Stop the TCP camera feed on the python application
      // this.http
      //   .get(`http://${IPAddress}:${NodePort}/livestream/stop`)
      //   .subscribe();
    }

    // Clean up the socket.
    if (this.socket) {
      this.socket.off('image', this.updateImage);
      this.socket.removeAllListeners();
      this.socket.close();
      this.socket = null;
    }
  }

  updateImage = (data): void => {
    this.imgSrc = 'data:image/jpeg;base64, ' + data.toString('base64');
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
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    if (this.isRecording) {
      // this.http
      //   .get(`http://${IPAddress}:${NodePort}/livestream/rotate/${event}`)
      //   .subscribe();
    }
  }

  sendCameraSettings(event: string): void {
    const { IPAddress, NodePort } = this.dataService.getConfigData();

    if (this.isRecording) {
      this.http
        .post(`http://${IPAddress}:${NodePort}/livestream/CamSettings/`, {
          camSettings: event,
        })
        .subscribe();
    }
  }
}
