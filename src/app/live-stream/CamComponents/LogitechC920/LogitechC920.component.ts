import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { LogitechC920Data, DataService } from '../../../services/data.service';

@Component({
  selector: 'LogitechC920',
  templateUrl: './LogitechC920.component.html',
})
export class LogitechC920 implements OnInit {
  @Output() sendCameraSettings = new EventEmitter<string>();
  @Output() sendVideoLength = new EventEmitter<string>();
  @Output() rotateStream = new EventEmitter<string>();
  camData: LogitechC920Data;
  videoLength: string;
  constructor(private dataService: DataService) {
    this.camData = this.dataService.getData() as LogitechC920Data;
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
    ) as LogitechC920Data;
    this.videoLength = this.camData.videoLength.toString();
    this.updateAutoSettings();
    this.updateCameraSettings();
  }
  updateAutoSettings(): void {
    const { Device } = this.dataService.getConfigData();
    const settingsCommand =
      `v4l2-ctl -d ${Device} --set-ctrl ` +
      `exposure_auto=` +
      (this.camData.exposureAuto ? 3 : 1) +
      `,white_balance_temperature_auto=` +
      (this.camData.whiteBalanceAuto ? 1 : 0) +
      `,focus_auto=` +
      (this.camData.focusAuto ? 1 : 0);
    this.sendCameraSettings.emit(settingsCommand);
    this.dataService.setCamData(this.camData);
  }
  updateCameraSettings(): void {
    const { Device } = this.dataService.getConfigData();
    const settings =
      `brightness=${this.camData.brightness},
      contrast=${this.camData.contrast},
      saturation=${this.camData.saturation},` +
      this.getWhiteBalance() +
      `gain=${this.camData.gain},
      power_line_frequency=${this.camData.powerFreq},
      sharpness=${this.camData.sharpness},
      backlight_compensation=${this.camData.backlightComp},` +
      this.getExposure() +
      `exposure_auto_priority=${this.camData.exposureAutoPriority},
      pan_absolute=${this.camData.panAbsolute * 3600},
      tilt_absolute=${this.camData.tiltAbsolute * 3600},` +
      this.getFocus() +
      `zoom_absolute=${this.camData.zoomAbsolute * 4 + 100}`;

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
  updateGain(newValue: number): void {
    if (newValue !== this.camData.gain) {
      const { Device } = this.dataService.getConfigData();
      this.camData.gain = newValue;
      const settings = `gain=${this.camData.gain}`;
      const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
      this.sendCameraSettings.emit(settingsCommand);
      this.dataService.setCamData(this.camData);
    }
  }
  updateSharpness(newValue: number): void {
    if (newValue === this.camData.sharpness) return;
    const { Device } = this.dataService.getConfigData();
    this.camData.sharpness = newValue;
    const settings = `sharpness=${this.camData.sharpness}`;
    const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
    this.sendCameraSettings.emit(settingsCommand);
    this.dataService.setCamData(this.camData);
  }
  updateFocusAbsolute(newValue: number): void {
    if (newValue === this.camData.focusAbsolute) return;
    const { Device } = this.dataService.getConfigData();
    this.camData.focusAbsolute = newValue;
    const settings = `focus_absolute=${(newValue * 2.5).toFixed(0)}`;
    const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
    this.sendCameraSettings.emit(settingsCommand);
    this.dataService.setCamData(this.camData);
  }
  updateExposureAbsolute(newValue: number): void {
    if (newValue === this.camData.exposureAbsolute) return;
    const { Device } = this.dataService.getConfigData();
    this.camData.exposureAbsolute = newValue;
    const settings = `exposure_absolute=${(newValue * 20.44 + 3).toFixed(0)}`;
    const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
    this.sendCameraSettings.emit(settingsCommand);
    this.dataService.setCamData(this.camData);
  }
  updateWhiteBalanceTemp(newValue: number): void {
    if (newValue !== this.camData.whiteBalanceTemp) {
      const { Device } = this.dataService.getConfigData();
      this.camData.whiteBalanceTemp = newValue;
      const settings = `white_balance_temperature=${newValue * 45 + 2000}`;
      const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
      this.sendCameraSettings.emit(settingsCommand);
      this.dataService.setCamData(this.camData);
    }
  }
  updateTiltAbsolute(newValue: number): void {
    if (newValue === this.camData.tiltAbsolute) return;
    const { Device } = this.dataService.getConfigData();
    this.camData.tiltAbsolute = newValue;
    const settings = `tilt_absolute=${newValue * 3600}`;
    const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
    this.sendCameraSettings.emit(settingsCommand);
    this.dataService.setCamData(this.camData);
  }
  updateZoomAbsolute(newValue: number): void {
    if (newValue === this.camData.zoomAbsolute) return;
    const { Device } = this.dataService.getConfigData();
    this.camData.zoomAbsolute = newValue;
    const settings = `zoom_absolute=${(newValue * 4 + 100).toFixed(0)}`;
    const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
    this.sendCameraSettings.emit(settingsCommand);
    this.dataService.setCamData(this.camData);
  }
  updatePanAbsolute(newValue: number): void {
    if (newValue === this.camData.panAbsolute) return;
    const { Device } = this.dataService.getConfigData();
    this.camData.panAbsolute = newValue;
    const settings = `pan_absolute=${this.camData.panAbsolute * 3600}`;
    const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
    this.sendCameraSettings.emit(settingsCommand);
    this.dataService.setCamData(this.camData);
  }
  updatePowerLineFreq(newValue: number): void {
    if (newValue === this.camData.powerFreq) return;
    const { Device } = this.dataService.getConfigData();
    this.camData.powerFreq = newValue;
    const settings = `power_line_frequency=${this.camData.powerFreq}`;
    const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
    this.sendCameraSettings.emit(settingsCommand);
    this.dataService.setCamData(this.camData);
  }
  getBackLightComp(): number {
    return this.camData.backlightComp ? 1 : 0;
  }
  getWhiteBalance(): string {
    return this.camData.whiteBalanceAuto
      ? ``
      : `white_balance_temperature=${this.camData.whiteBalanceTemp * 45 +
          2000},`;
  }
  getFocus(): string {
    return this.camData.focusAuto
      ? ``
      : `focus_absolute=${this.camData.focusAbsolute * 2.5},`;
  }
  getExposure(): string {
    return this.camData.exposureAuto
      ? ``
      : `exposure_absolute=${this.camData.exposureAbsolute * 20.44 + 3},`;
  }
  rotateVideoStream(toggle: boolean): void {
    if ((toggle ? 1 : 0) !== this.camData.verticalFlip) {
      this.camData.verticalFlip = toggle ? 1 : 0;
      this.rotateStream.emit(this.camData.verticalFlip.toString());
      this.dataService.setCamData(this.camData);
    }
  }
  backlightCompensationToggle(toggle: boolean): void {
    if ((toggle ? 1 : 0) !== this.camData.backlightComp) {
      const { Device } = this.dataService.getConfigData();
      this.camData.backlightComp = toggle ? 1 : 0;
      const settings = `backlight_compensation=${this.camData.backlightComp}`;
      const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
      this.sendCameraSettings.emit(settingsCommand);
      this.dataService.setCamData(this.camData);
    }
  }
  autoExposurePriorityToggle(toggle: boolean): void {
    if ((toggle ? 1 : 0) !== this.camData.exposureAutoPriority) {
      const { Device } = this.dataService.getConfigData();
      this.camData.exposureAutoPriority = toggle ? 1 : 0;
      const settings = `exposure_auto_priority=${this.camData.exposureAutoPriority}`;
      const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl ${settings}`;
      this.sendCameraSettings.emit(settingsCommand);
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
  updateFocusSettings(toggle: boolean): void {
    if ((toggle ? 1 : 0) !== this.camData.focusAuto) {
      this.camData.focusAuto = toggle ? 1 : 0;
      const { Device } = this.dataService.getConfigData();
      const settingsCommand = `v4l2-ctl -d ${Device} --set-ctrl focus_auto=${this.camData.focusAuto}`;
      this.sendCameraSettings.emit(settingsCommand);
      this.dataService.setCamData(this.camData);
    }
  }
}
