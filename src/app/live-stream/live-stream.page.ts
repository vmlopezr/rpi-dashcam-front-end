import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { AlertController } from '@ionic/angular';
import * as io from 'socket.io-client';

const errmessage =
  'An error occurred with the recording process. \nVerify the camera is the correct one as chosen on the home screen.';
const errconnectmsg =
  'Could not connect to the livestream server. \nVerify the camera is running, and that the Raspberry Pi operational.';
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
    this.liveStreamConnect();
  }
  /**
   *  Handle browser and header back buttons to close socket cleanly
   */
  ionViewWillLeave(): void {
    console.log('leaving page');
    this.backHandler();
  }
  /**
   * Start attempt to connect to livestream server. Sets timeout to cancel and
   * warn user if theres issues.
   */
  liveStreamConnect(): void {
    if (!this.isRecording) return;

    this.startSocket();
    this.timeout = setTimeout(() => {
      // Clean up socket on timeout, alert user there may be an issue
      this.timeout = null;
      this.disconnected = true;
      // Clear the spinner animation
      this.showSpinner = false;

      this.presentAlert('Connection Error', errconnectmsg);
      this.cleanUpSocket();
    }, 15000);
  }
  /** Connect socket.io to livestream server */
  startSocket(): void {
    const { IPAddress, LiveStreamPort } = this.dataService.getConfigData();
    if (!this.socket) {
      this.socket = io.connect(`http://${IPAddress}:${LiveStreamPort}`);
      this.startListener();
    }
  }
  /** Set listeners for socket.io */
  startListener(): void {
    this.socket.on('connect', () => {
      clearTimeout(this.timeout);
      console.log('Livestream connection successful.');
      this.showSpinner = false;
      this.timeout = null;
    });

    this.socket.on('image', this.updateImage);
    this.socket.on('error', err => {
      console.log(err);
      this.presentAlert('Streaming Error', errmessage);
    });
  }
  /** Present an alert with a header and message */
  async presentAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
  /** Return true if orientation is portrait, false otherwise. For PC's this is defaulted to true. */
  isPortrait(): boolean {
    if (this._platform.platforms().includes('desktop')) {
      return true;
    } else {
      return this._platform.isPortrait();
    }
  }
  /** Action run when page is exited. Starts socket.io cleanup if it is established.*/
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
  /** Clean up socket.io and tell back-end server to stop the livestream gstreamer pipeline. */
  cleanUpSocket(): void {
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    if (!this.disconnected) {
      // Stop the TCP camera feed on the python application
      this.http
        .get(`http://${IPAddress}:${NodePort}/livestream/stop`)
        .subscribe();
    }

    // Clean up the socket.
    if (this.socket) {
      this.socket.off('image', this.updateImage);
      this.socket.removeAllListeners();
      this.socket.close();
      this.socket = null;
    }
  }
  /** Receive image data from the livestream server.*/
  updateImage = (data): void => {
    this.imgSrc = 'data:image/jpeg;base64, ' + data.toString('base64');
  };
  /** Sanitize the data received from the livestream server and send it to the image tag in html.*/
  getImgContent(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.imgSrc);
  }
  /** Return true if the camera is a Logitech C920 webcam.*/
  isLogitechC920(): boolean {
    return this.dataService.getCamera() === 'Logitech Webcam HD C920';
  }
  /** Return true if the camera is a Lifecam HD 3000 webcam.*/
  isMSHD3000(): boolean {
    return this.dataService.getCamera() === 'Microsoft LifeCam HD-3000';
  }
  /** Return true if the camera is not one of the supported cameras. This
   * will set the camera control to only change video length and orientation.
   */
  isDefaultCam(): boolean {
    return (
      this.dataService.getCamera() !== 'Logitech Webcam HD C920' &&
      this.dataService.getCamera() !== 'Microsoft LifeCam HD-3000'
    );
  }
  /** Update the video length in the database. */
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
  /** Update the video orination in the database. */
  rotateStream(event: string): void {
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    if (this.isRecording) {
      this.http
        .get(`http://${IPAddress}:${NodePort}/livestream/rotate/${event}`)
        .subscribe();
    }
  }
  /** Send the updated camera settings to the back-end for database updates and run stream update.*/
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
