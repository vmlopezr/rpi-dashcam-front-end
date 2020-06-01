import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';
import { DataService } from '../services/data.service';
import * as io from 'socket.io-client';

const errmessage =
  `An error occurred with the recording process. Verify the ` +
  `camera is the correct one as chosen on the home screen.`;
const errconnectmsg =
  `Could not connect to the livestream server. \nVerify the ` +
  `camera is running, and that the Raspberry Pi operational. The recording process ` +
  `may have exited. Check the error log for more information.`;
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
  ) {}
  ngOnInit(): void {
    const { IPAddress, NodePort } = this.dataService.getConfigData();

    this.socket = null;
    // disconnected flag only get set if a socket event handler detects an error
    this.disconnected = false;
    this.showSpinner = true;
    this.isRecording = this.dataService.getIsRecording();
    this.imgSrc = `http://${IPAddress}:${NodePort}/videos/thumbnail/loading.jpg`;
    this.liveStreamConnect();

    // Check for window close
    window.addEventListener('beforeunload', this.handleUnload);

    // Check if tab is blurred or put in background
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }
  /**
   *  Handle browser and header back buttons to close socket cleanly
   */
  ionViewWillLeave(): void {
    this.handleExit();
  }
  /** Detect whether the user moved tabs and put the application in the background.
   *  In such a case, stop the streaming and prompt to re-enter to access the stream.
   */
  handleVisibilityChange = (): void => {
    if (document.visibilityState === 'hidden' && this.isRecording) {
      this.handleExit();
      this.dataService.presentAlert(
        'Application Tab moved to background',
        `The tab has been detected in the background. The livestream connection ` +
          `will be closed. Re-enter the page to view the livestream.`,
      );
    }
  };
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
      this.dataService.setIsRecording(false);
      this.dataService.presentAlert('Connection Timeout Error', errconnectmsg);
      this.cleanUpSocket();
    }, 10000);
  }
  /** Action run when page is exited. Starts socket.io cleanup if it is established.*/
  handleExit = (): void => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    if (this.isRecording) {
      this.isRecording = false;
      this.cleanUpSocket();
    }
    this.dataService.updateCameraDataDB();
    window.removeEventListener('beforeunload', this.handleExit);
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange,
    );
  };
  /** Starts the exit handler when the page is closed */
  handleUnload = (): void => {
    this.handleExit();
  };
  /** Connect socket.io to livestream server */
  startSocket(): void {
    const { IPAddress, LiveStreamPort } = this.dataService.getConfigData();
    if (!this.socket) {
      this.socket = io.connect(`http://${IPAddress}:${LiveStreamPort}`, {
        transports: ['websocket'],
      });
      this.startListener();
    }
  }

  /** Set listeners for socket.io */
  startListener(): void {
    /* The python process stops the livestream socket on v4l2-ctl error*/
    this.socket.on('v4l2-error', () => {
      this.disconnected = true;
      this.cleanUpSocket();
      this.dataService.presentAlert(
        'Caught a V4L2 Error',
        `The camera connected may not be ` +
          `one of the cameras selected in the home screen. The V4L drivers support ` +
          `different settings for each camera and may result in errors.`,
      );
    });
    this.socket.on('connect', () => {
      clearTimeout(this.timeout);
      this.showSpinner = false;
      this.timeout = null;
    });
    /** Update image in the html*/
    this.socket.on('image', this.updateImage);

    /** Catch errors on socket.io */
    this.socket.on('error', err => {
      this.disconnected = true;
      this.dataService.presentAlert('Streaming Error', errmessage);
      this.cleanUpSocket();
    });
  }

  /** Return true if orientation is portrait, false otherwise. For PC's this is defaulted to true. */
  isPortrait(): boolean {
    if (this._platform.platforms().includes('desktop')) {
      return true;
    } else {
      return this._platform.isPortrait();
    }
  }

  /** Clean up socket.io and tell back-end server to stop the livestream gstreamer pipeline. */
  cleanUpSocket(): void {
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    if (!this.disconnected) {
      // Stop the TCP camera feed on the python application
      this.http
        .get(`http://${IPAddress}:${NodePort}/livestream/stop`)
        .subscribe();
      this.disconnected = false;
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
