import { Component, OnInit, EventEmitter, Output } from '@angular/core';
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
  @Output() rotateStream = new EventEmitter<string>();
  camData: MSHD3000Data;
  videoLength: string;
  constructor(private dataService: DataService) {
    //getData from DB
    this.camData = this.dataService.getData() as MSHD3000Data;
    this.videoLength = this.camData.videoLength.toString();
  }
  ngOnInit(): void {
    if (this.dataService.getIsRecording()) {
      this.updateAutoSettings();
      this.updateCameraSettings();
    }
  }
  updateVideoLength(): void {
    this.camData.videoLength = parseInt(this.videoLength);
    this.sendVideoLength.emit(this.camData.videoLength.toString());
    this.dataService.setCamData(this.camData);
  }
  setDefault(): void {
    this.rotateVideoStream(false);
    this.camData = this.dataService.getDataDefaults(
      this.dataService.getCamera(),
    ) as MSHD3000Data;
    this.videoLength = this.camData.videoLength.toString();
    this.updateAutoSettings();
    this.updateCameraSettings();
  }
  updateCameraSettings(): void {
    const { Device } = this.dataService.getConfigData();
    const settings =
      `brightness=${this.camData.brightness},
      contrast=${this.camData.contrast},
      saturation=${this.camData.saturation},` +
      this.getWhiteBalance() +
      `power_line_frequency=${this.camData.powerFreq},
      sharpness=${this.camData.sharpness},
      backlight_compensation=${this.camData.backlightComp},` +
      this.getExposure() +
      `pan_absolute=${this.camData.panAbsolute},
      tilt_absolute=${this.camData.tiltAbsolute},` +
      `zoom_absolute=${this.camData.zoomAbsolute}`;

    const settingsCommand =
      `v4l2-ctl -d ${Device} --set-ctrl ` + settings.replace(/\s/g, '');
    this.sendCameraSettings.emit(settingsCommand);
    this.dataService.setCamData(this.camData);
  }
  updateBrightness(newValue: number): void {
    if (newValue !== this.camData.brightness) {
      const { Device } = this.dataService.getConfigData();
      this.camData.brightness = newValue;
      const settings = `brightness=${this.camData.brightness}`;
      const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
      this.sendCameraSettings.emit(settingsCommand);
      this.dataService.setCamData(this.camData);
    }
  }
  updateContrast(newValue: number): void {
    if (newValue !== this.camData.contrast) {
      const { Device } = this.dataService.getConfigData();
      this.camData.contrast = newValue;
      const settings = `contrast=${this.camData.contrast}`;
      const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
      this.sendCameraSettings.emit(settingsCommand);
      this.dataService.setCamData(this.camData);
    }
  }
  updateSaturation(newValue: number): void {
    if (newValue !== this.camData.saturation) {
      const { Device } = this.dataService.getConfigData();
      this.camData.saturation = newValue;
      const settings = `saturation=${this.camData.saturation}`;
      const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
      this.sendCameraSettings.emit(settingsCommand);
      this.dataService.setCamData(this.camData);
    }
  }
  updateSharpness(newValue: number): void {
    if (newValue !== this.camData.sharpness) {
      const { Device } = this.dataService.getConfigData();
      this.camData.sharpness = newValue;
      const settings = `sharpness=${this.camData.sharpness}`;
      const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
      this.sendCameraSettings.emit(settingsCommand);
      this.dataService.setCamData(this.camData);
    }
  }
  updateExposureAbsolute(newValue: number): void {
    if (newValue !== this.camData.exposureAbsolute) {
      const { Device } = this.dataService.getConfigData();
      this.camData.exposureAbsolute = newValue;
      const settings = `exposure_absolute=${this.camData.exposureAbsolute}`;
      const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
      this.sendCameraSettings.emit(settingsCommand);
      this.dataService.setCamData(this.camData);
    }
  }
  updateWhiteBalanceTemp(newValue: number): void {
    if (newValue !== this.camData.whiteBalanceTemp) {
      const { Device } = this.dataService.getConfigData();
      this.camData.whiteBalanceTemp = newValue;
      const settings = `white_balance_temperature=${this.camData.whiteBalanceTemp}`;
      const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
      this.sendCameraSettings.emit(settingsCommand);
      this.dataService.setCamData(this.camData);
    }
  }
  updateBackLightComp(newValue: number): void {
    if (newValue !== this.camData.backlightComp) {
      const { Device } = this.dataService.getConfigData();
      this.camData.backlightComp = newValue;
      const settings = `backlight_compensation=${this.camData.backlightComp}`;
      const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
      this.sendCameraSettings.emit(settingsCommand);
      this.dataService.setCamData(this.camData);
    }
  }
  updateTiltAbsolute(newValue: number): void {
    if (newValue !== this.camData.tiltAbsolute) {
      const { Device } = this.dataService.getConfigData();
      this.camData.tiltAbsolute = newValue;
      const settings = `tilt_absolute=${this.camData.tiltAbsolute}`;
      const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
      this.sendCameraSettings.emit(settingsCommand);
      this.dataService.setCamData(this.camData);
    }
  }
  updateZoomAbsolute(newValue: number): void {
    if (newValue !== this.camData.zoomAbsolute) {
      const { Device } = this.dataService.getConfigData();
      this.camData.zoomAbsolute = newValue;
      const settings = `zoom_absolute=${this.camData.zoomAbsolute}`;
      const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
      this.sendCameraSettings.emit(settingsCommand);
      this.dataService.setCamData(this.camData);
    }
  }
  updatePanAbsolute(newValue: number): void {
    if (newValue !== this.camData.panAbsolute) {
      const { Device } = this.dataService.getConfigData();
      this.camData.panAbsolute = newValue;
      const settings = `pan_absolute=${this.camData.panAbsolute}`;
      const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
      this.sendCameraSettings.emit(settingsCommand);
      this.dataService.setCamData(this.camData);
    }
  }
  updatePowerLineFreq(newValue: number): void {
    if (newValue !== this.camData.powerFreq) {
      const { Device } = this.dataService.getConfigData();
      this.camData.powerFreq = newValue;
      const settings = `power_line_frequency=${this.camData.powerFreq}`;
      const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
      this.sendCameraSettings.emit(settingsCommand);
      this.dataService.setCamData(this.camData);
    }
  }
  updateAutoSettings(): void {
    const { Device } = this.dataService.getConfigData();

    const settingsCommand =
      `v4l2-ctl -d ${Device} --set-ctrl exposure_auto=` +
      (this.camData.exposureAuto ? 3 : 1) +
      `,white_balance_temperature_auto=` +
      (this.camData.whiteBalanceAuto ? 1 : 0);

    this.sendCameraSettings.emit(settingsCommand);
    this.dataService.setCamData(this.camData);
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
  rotateVideoStream(toggle: boolean): void {
    if ((toggle ? 1 : 0) !== this.camData.verticalFlip) {
      this.camData.verticalFlip = toggle ? 1 : 0;
      this.rotateStream.emit(this.camData.verticalFlip.toString());
      this.dataService.setCamData(this.camData);
    }
  }
  exposureAutoToggle(toggle: boolean): void {
    if ((toggle ? 1 : 0) !== this.camData.exposureAuto) {
      this.camData.exposureAuto = toggle ? 1 : 0;
      this.updateExposureAuto();
    }
  }
  updateExposureAuto(): void {
    const { Device } = this.dataService.getConfigData();
    const settingsCommand =
      `v4l2-ctl -d ${Device} --set-ctrl exposure_auto=` +
      (this.camData.exposureAuto ? 3 : 1);
    this.sendCameraSettings.emit(settingsCommand);
    this.dataService.setCamData(this.camData);
  }
  whiteBalanceAutoToggle(toggle: boolean): void {
    if ((toggle ? 1 : 0) !== this.camData.whiteBalanceAuto) {
      this.camData.whiteBalanceAuto = toggle ? 1 : 0;
      this.updateWhiteBalanceAuto();
    }
  }
  updateWhiteBalanceAuto(): void {
    const { Device } = this.dataService.getConfigData();
    const settingsCommand =
      `v4l2-ctl -d ${Device} --set-ctrl white_balance_temperature_auto=` +
      (this.camData.whiteBalanceAuto ? 1 : 0);
    this.sendCameraSettings.emit(settingsCommand);
    this.dataService.setCamData(this.camData);
  }
}
