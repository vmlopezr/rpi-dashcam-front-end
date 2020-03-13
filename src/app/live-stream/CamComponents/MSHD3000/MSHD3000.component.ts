import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { StreamService } from '../../../services/streaming.service';
import { ConfigService } from '../../../services/config.service';
import { DataService } from '../../../services/data.service';
import { MSHD3000Data } from '../../../services/data.service';
@Component({
  selector: 'MSHD3000',
  templateUrl: './MSHD3000.component.html',
  styleUrls: ['./MSHD3000.component.scss'],
})
export class MSHD3000 implements OnInit {
  @Output() sendCameraSettings = new EventEmitter<string>();
  @Output() sendVideoLength = new EventEmitter<string>();
  @Output() rotateStream = new EventEmitter<void>();
  camData: MSHD3000Data;
  videoLength: number;
  width: number;
  height: number;
  settingsCommand: string;
  constructor(
    private configService: ConfigService,
    private dataService: DataService,
  ) {
    this.videoLength = this.dataService.getVideoLength();
    this.width = window.innerWidth;
    this.height = this.width - 100;
    //getData from DB
    this.camData = this.dataService.getData() as MSHD3000Data;
    console.log('constructor, exposure auto: ' + this.camData.exposureAuto);
  }
  ngOnInit(): void {
    if (this.dataService.getIsRecording()) {
      this.updateAutoSettings();
    }
  }
  rotateVideoStream(): void {
    this.rotateStream.emit();
  }
  updateVideoLength(): void {
    this.sendVideoLength.emit(this.videoLength.toString());
  }

  setDefault(): void {
    this.camData = this.dataService.getDataDefaults(
      this.dataService.getCamera(),
    ) as MSHD3000Data;
    this.updateAutoSettings();
    this.updateCameraSettings();
  }
  updateCameraSettings(): void {
    const device = this.configService.getDevice();
    const settings =
      `brightness=${this.camData.brightness},
      contrast=${this.camData.contrast},
      saturation=${this.camData.saturation},` +
      this.getWhiteBalance() +
      `power_line_frequency=${this.camData.powerFreq},
      sharpness=${this.camData.sharpness},
      backlight_compensation=${this.getBackLightComp()},` +
      this.getExposure() +
      `pan_absolute=${this.camData.panAbsolute},
      tilt_absolute=${this.camData.tiltAbsolute},` +
      `zoom_absolute=${this.camData.zoomAbsolute}`;

    this.settingsCommand =
      `v4l2-ctl -d ${device} --set-ctrl ` + settings.replace(/\s/g, '');
    this.sendCameraSettings.emit(this.settingsCommand);
  }
  updateAutoSettings(): void {
    const device = this.configService.getDevice();

    this.settingsCommand =
      `v4l2-ctl -d ${device} --set-ctrl ` +
      `exposure_auto=` +
      (this.camData.exposureAuto ? 3 : 1) +
      `,white_balance_temperature_auto=` +
      (this.camData.whiteBalanceAuto ? 1 : 0);

    this.sendCameraSettings.emit(this.settingsCommand);
  }
  getBackLightComp(): number {
    return this.camData.backlightComp ? 1 : 0;
  }

  getExposure(): string {
    return this.camData.exposureAuto
      ? ``
      : `exposure_absolute=${this.camData.exposureAbsolute},`;
  }

  getWhiteBalance(): string {
    return this.camData.whiteBalanceAuto
      ? ``
      : `white_balance_temperature=${this.camData.whiteBalanceTemp},`;
  }
  exposureAutoToggle(toggle): void {
    this.camData.exposureAuto = toggle.checked;
    this.updateExposureAuto();
  }
  updateExposureAuto(): void {
    const device = this.configService.getDevice();
    this.settingsCommand =
      `v4l2-ctl -d ${device} --set-ctrl ` +
      `exposure_auto=` +
      (this.camData.exposureAuto ? 3 : 1);
    console.log('exposure auto: ' + this.camData.exposureAuto);
    this.sendCameraSettings.emit(this.settingsCommand);
  }
  whiteBalanceAutoToggle(toggle): void {
    this.camData.whiteBalanceAuto = toggle.checked;
    this.updateWhiteBalanceAuto();
  }
  updateWhiteBalanceAuto(): void {
    const device = this.configService.getDevice();
    this.settingsCommand =
      `v4l2-ctl -d ${device} --set-ctrl ` +
      `white_balance_temperature_auto=` +
      (this.camData.whiteBalanceAuto ? 1 : 0);
    console.log('white balance auto: ' + this.camData.whiteBalanceAuto);
    this.sendCameraSettings.emit(this.settingsCommand);
  }
}
