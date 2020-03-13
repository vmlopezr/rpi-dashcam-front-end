import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CamData, DataService } from '../../../services/data.service';
import { StreamService } from '../../../services/streaming.service';
import { ConfigService } from '../../../services/config.service';
@Component({
  selector: 'DefaultCam',
  templateUrl: './DefaultCam.component.html',
  styleUrls: ['./DefaultCam.component.scss'],
})
export class DefaultCam implements OnInit {
  @Output() sendCameraSettings = new EventEmitter<string>();
  @Output() sendVideoLength = new EventEmitter<string>();
  @Output() rotateStream = new EventEmitter<void>();
  camData: CamData;
  videoLength: number;
  width: number;
  height: number;
  settingsCommand: string;
  camera: string;
  constructor(
    private configService: ConfigService,
    private dataService: DataService,
  ) {
    console.log('default camera constructor');
    this.videoLength = this.dataService.getVideoLength();
    this.camera = this.dataService.getCamera();
    this.width = window.innerWidth;
    this.height = this.width - 100;
    this.camData = this.dataService.getData() as CamData;
  }
  ngOnInit(): void {
    if (this.dataService.getIsRecording()) {
      this.updateAutoSettings();
    }
  }
  updateVideoLength(): void {
    this.sendVideoLength.emit(this.videoLength.toString());
  }
  rotateVideoStream(): void {
    this.rotateStream.emit();
  }
  setDefault(): void {
    this.camData = this.dataService.getDataDefaults(
      this.dataService.getCamera(),
    ) as CamData;
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
      (this.camData.whiteBalanceAuto ? 1 : 0) +
      `,focus_auto=` +
      (this.camData.focusAuto ? 1 : 0);
    this.sendCameraSettings.emit(this.settingsCommand);
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

    this.sendCameraSettings.emit(this.settingsCommand);
  }
  updateFocusSettings(evt): void {
    const device = this.configService.getDevice();
    this.settingsCommand =
      `v4l2-ctl -d ${device} --set-ctrl ` +
      `focus_auto=` +
      (this.camData.focusAuto ? 1 : 0);
    this.sendCameraSettings.emit(this.settingsCommand);
  }
}
