import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '../services/config.service';
import { StreamService } from '../services/streaming.service';
import { ModalController, IonApp } from '@ionic/angular';
import { LivestreamModal } from './Modals/livestream-modal';
import { Platform } from '@ionic/angular';

export interface CamData {
  brightness: number;
  contrast: number;
  saturation: number;
  gain: number;
  whiteBalanceTemp: number;
  sharpness: number;
  exposureAbsolute: number;
  panAbsolute: number;
  tiltAbsolute: number;
  focusAbsolute: number;
  zoomAbsolute: number;
  powerFreq: number;
  exposureAuto: boolean;
  whiteBalanceAuto: boolean;
  exposureAutoPriority: boolean;
  focusAuto: boolean;
  backlightComp: boolean;
}
@Component({
  selector: 'app-live-stream',
  templateUrl: './live-stream.page.html',
  styleUrls: ['./live-stream.page.scss'],
})
export class LiveStreamPage implements OnInit {
  // Back End Info
  NodeAddress: string;
  NodePort: number;
  Device: string;
  LiveStreamPort: number;

  // Front End Info
  camData: CamData;
  videoLength: number;
  test: number;
  imgSrc: string;
  socket: any;
  image: SafeUrl;
  width: number;
  height: number;
  settingsCommand: string;
  platform: Platform;

  constructor(
    private _platform: Platform,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private modalController: ModalController,
    configService: ConfigService,
    private streamService: StreamService,
  ) {
    this.platform = _platform;
    this.videoLength = 30;
    this.LiveStreamPort = configService.getLiveStreamPort();
    this.NodeAddress = configService.getNodeAddress();
    this.NodePort = configService.getNodePort();
    this.Device = configService.getDevice();
    this.width = window.innerWidth;
    this.height = this.width - 100;
    this.camData = this.streamService.getData();
    // this.imgSrc = `http://${this.NodeAddress}:${this.NodePort}
    //   /rest/info/thumbnail/loading.jpg`.replace(/\s/g, '');
    this.imgSrc = './assets/icon/car.jpg';
    // this.streamService.startSocket();
    // this.socket = this.streamService.getSocket();
    // this.startListener();
    console.log('Live stream constructor running');
  }
  ngOnInit(): void {
    // this.updateAutoSettings();
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
    // // Stop the TCP camera feed on the python application
    // this.http
    //   .get(`http://${this.NodeAddress}:${this.NodePort}/rest/info/stop`)
    //   .subscribe();
    // // cleanup socket
    // console.log('back to home page');
    // this.socket.off('image', this.updateImage);
    // this.socket.destroy();
    // this.streamService.stopSocket();
    console.log('Leaving Streaming Page');
    this.streamService.saveData(this.camData);
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
  setDefault(): void {
    this.camData = this.streamService.dataDefaults();
    this.sendCameraSettings();
  }

  sendVideoLength(): void {
    const socketdata = 'newtime ' + this.videoLength.toString();
    this.http
      .post(`http://${this.NodeAddress}:${this.NodePort}/rest/info/VidLength`, {
        data: socketdata,
      })
      .subscribe();
    console.log('data updated');
  }
  rotateStream(): void {
    console.log('rotated');
    // this.http
    // .get(`http://${this.NodeAddress}:${this.NodePort}/rest/info/rotate`)
    // .subscribe();
  }

  updateCameraSettings(): void {
    const settings =
      `brightness=${this.camData.brightness},
      contrast=${this.camData.contrast},
      saturation=${this.camData.saturation},` +
      this.getWhiteBalance() +
      `gain=${this.camData.gain},
      power_line_frequency=${this.camData.powerFreq},
      sharpness=${this.camData.sharpness},
      backlight_compensation=${this.getBackLightComp()},` +
      this.getExposure() +
      `exposure_auto_priority=${this.getExposurePriority()},
      pan_absolute=${this.camData.panAbsolute},
      tilt_absolute=${this.camData.tiltAbsolute},` +
      this.getFocus() +
      `zoom_absolute=${this.camData.zoomAbsolute}`;

    this.settingsCommand =
      `v4l2-ctl -d ${this.Device} --set-ctrl ` + settings.replace(/\s/g, '');
    this.sendCameraSettings();
  }
  sendCameraSettings(): void {
    this.http
      .post(
        `http://${this.NodeAddress}:${this.NodePort}/rest/info/CamSettings`,
        {
          data: this.settingsCommand,
        },
      )
      .subscribe();
    console.log('data updated length');
  }
  updateAutoSettings(): void {
    this.settingsCommand =
      `v4l2-ctl -d ${this.Device} --set-ctrl ` +
      `exposure_auto=` +
      (this.camData.exposureAuto ? 3 : 1) +
      `,white_balance_temperature_auto=` +
      (this.camData.whiteBalanceAuto ? 1 : 0) +
      `,focus_auto=` +
      (this.camData.focusAuto ? 1 : 0);
    this.sendCameraSettings();
  }
  getBackLightComp(): number {
    return this.camData.backlightComp ? 1 : 0;
  }
  getFocus(): string {
    return this.camData.focusAuto
      ? ``
      : `focus_absolute=${this.camData.focusAbsolute},`;
  }

  getExposure(): string {
    return this.camData.exposureAuto
      ? ``
      : `exposure_absolute=${this.camData.exposureAbsolute},`;
  }
  getExposurePriority(): number {
    return this.camData.exposureAutoPriority ? 1 : 0;
  }
  getWhiteBalance(): string {
    return this.camData.whiteBalanceAuto
      ? ``
      : `white_balance_temperature=${this.camData.whiteBalanceTemp},`;
  }
  updateExposureSettings(): void {
    this.settingsCommand =
      `v4l2-ctl -d ${this.Device} --set-ctrl ` +
      `exposure_auto=` +
      (this.camData.exposureAuto ? 3 : 1);
    this.sendCameraSettings();
  }
  updateWhiteBalanceSettings(): void {
    this.settingsCommand =
      `v4l2-ctl -d ${this.Device} --set-ctrl ` +
      `white_balance_temperature_auto=` +
      (this.camData.whiteBalanceAuto ? 1 : 0);
    this.sendCameraSettings();
  }
  updateFocusSettings(evt): void {
    this.settingsCommand =
      `v4l2-ctl -d ${this.Device} --set-ctrl ` +
      `focus_auto=` +
      (this.camData.focusAuto ? 1 : 0);
    this.sendCameraSettings();
  }
}
