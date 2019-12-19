import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { IonicImageViewerModule } from 'ionic-img-viewer';
import * as io from 'socket.io-client';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '../services/config.service';

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
  test: number;
  imgSrc: string;
  socket: any;
  image: SafeUrl;
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
  width: number;
  height: number;
  settingsCommand: string;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private configService: ConfigService,
  ) {
    this.test = 100;
    this.LiveStreamPort = configService.getLiveStreamPort();
    this.NodeAddress = configService.getNodeAddress();
    this.NodePort = configService.getNodePort();
    this.Device = configService.getDevice();
    this.width = window.innerWidth;
    this.height = this.width - 100;
    this.resetDefaults();
    this.imgSrc = `http://${this.NodeAddress}:${this.NodePort}/rest/info/thumbnail/loading.jpg`;
    // this.imgSrc = 'assets/loading.jpg';

    console.log(
      'connecting to: ' + `http://${this.NodeAddress}:${this.LiveStreamPort}`,
    );
    this.socket = io.connect(
      `http://${this.NodeAddress}:${this.LiveStreamPort}`,
    );
    this.updateImage();
  }

  ngOnInit(): void {
    this.updateAutoSettings();
  }

  private stopStreamServer(): void {
    this.http
      .get(`http://${this.NodeAddress}:${this.NodePort}/rest/info/stop`)
      .subscribe();
    this.socket.destroy();
    console.log('stopped the streaming server');
  }
  private updateImage(): void {
    this.socket.on('image', data => {
      this.imgSrc = 'data:image/jpeg;base64, ' + data.toString('base64');
    });
  }
  private getImgContent(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.imgSrc);
  }
  private resetDefaults(): void {
    this.brightness = 128;
    this.contrast = 128;
    this.saturation = 128;
    this.gain = 0;
    this.whiteBalanceTemp = 4000;
    this.sharpness = 128;
    this.exposureAbsolute = 250;
    this.panAbsolute = 0;
    this.tiltAbsolute = 0;
    this.focusAbsolute = 0;
    this.zoomAbsolute = 100;
    this.powerFreq = 2;
    this.whiteBalanceAuto = true;
    this.exposureAuto = true;
    this.exposureAutoPriority = false;
    this.focusAuto = true;
    this.backlightComp = true;
  }
  private updateAutoSettings(): void {
    this.settingsCommand =
      `v4l2-ctl -d ${this.Device} --set-ctrl ` +
      `exposure_auto=` +
      (this.exposureAuto ? 3 : 1) +
      `,white_balance_temperature_auto=` +
      (this.whiteBalanceAuto ? 1 : 0) +
      `,focus_auto=` +
      (this.focusAuto ? 1 : 0);
    this.sendCameraSettings();
  }
  private updateExposureSettings(): void {
    this.settingsCommand =
      `v4l2-ctl -d ${this.Device} --set-ctrl ` +
      `exposure_auto=` +
      (this.exposureAuto ? 3 : 1);
    this.sendCameraSettings();
  }
  private updateWhiteBalanceSettings(): void {
    this.settingsCommand =
      `v4l2-ctl -d ${this.Device} --set-ctrl ` +
      `white_balance_temperature_auto=` +
      (this.whiteBalanceAuto ? 1 : 0);
    this.sendCameraSettings();
  }
  private updateFocusSettings(): void {
    this.settingsCommand =
      `v4l2-ctl -d ${this.Device} --set-ctrl ` +
      `focus_auto=` +
      (this.focusAuto ? 1 : 0);
    this.sendCameraSettings();
  }
  private sendCameraSettings(): void {
    this.http
      .post(
        `http://${this.NodeAddress}:${this.NodePort}/rest/info/CamSettings`,
        {
          command: this.settingsCommand,
        },
      )
      .subscribe();
    console.log('data updated');
  }
  private getBackLightComp(): number {
    return this.backlightComp ? 1 : 0;
  }
  private updateCameraSettings(): void {
    this.test = this.brightness;
    const settings =
      `brightness=${this.brightness},
      contrast=${this.contrast},
      saturation=${this.saturation},` +
      this.getWhiteBalance() +
      `gain=${this.gain},
      power_line_frequency=${this.powerFreq},
      sharpness=${this.sharpness},
      backlight_compensation=${this.getBackLightComp()},` +
      this.getExposure() +
      `exposure_auto_priority=${this.getExposurePriority()},
      pan_absolute=${this.panAbsolute},
      tilt_absolute=${this.tiltAbsolute},` +
      this.getFocus() +
      `zoom_absolute=${this.zoomAbsolute}`;

    this.settingsCommand =
      `v4l2-ctl -d ${this.Device} --set-ctrl ` + settings.replace(/\s/g, '');
    this.sendCameraSettings();
  }

  private getFocus(): string {
    return this.focusAuto ? `` : `focus_absolute=${this.focusAbsolute},`;
  }

  private getExposure(): string {
    return this.exposureAuto
      ? ``
      : `exposure_absolute=${this.exposureAbsolute},`;
  }
  private getExposurePriority(): number {
    return this.exposureAutoPriority ? 1 : 0;
  }
  private getWhiteBalance(): string {
    return this.whiteBalanceAuto
      ? ``
      : `white_balance_temperature=${this.whiteBalanceTemp},`;
  }
}

// v4l2-ctl -d ${this.Device} --set-ctrl brightness=129,contrast=129,saturation=129
