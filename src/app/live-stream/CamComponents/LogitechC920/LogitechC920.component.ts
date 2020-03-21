import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { LogitechC920Data, DataService } from '../../../services/data.service';

@Component({
  selector: 'LogitechC920',
  templateUrl: './LogitechC920.component.html',
  styleUrls: ['./LogitechC920.component.scss'],
})
export class LogitechC920 implements OnInit {
  @Output() sendCameraSettings = new EventEmitter<string>();
  @Output() sendVideoLength = new EventEmitter<string>();
  @Output() rotateStream = new EventEmitter<number>();
  camData: LogitechC920Data;
  width: number;
  height: number;
  settingsCommand: string;
  constructor(private dataService: DataService) {
    this.width = window.innerWidth;
    this.height = this.width - 100;
    this.camData = this.dataService.getData() as LogitechC920Data;
  }
  ngOnInit(): void {
    if (this.dataService.getIsRecording()) {
      this.updateAutoSettings();
    }
  }
  updateVideoLength(): void {
    this.sendVideoLength.emit(this.camData.videoLength.toString());
    this.dataService.setCamData(this.camData);
  }
  rotateVideoStream(toggle: { checked: boolean }): void {
    this.camData.verticalFlip = toggle.checked ? 1 : 0;
    this.rotateStream.emit(this.camData.verticalFlip);
    this.dataService.setCamData(this.camData);
  }
  setDefault(): void {
    this.camData = this.dataService.getDataDefaults(
      this.dataService.getCamera(),
    ) as LogitechC920Data;
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
      `gain=${this.camData.gain},
      power_line_frequency=${this.camData.powerFreq},
      sharpness=${this.camData.sharpness},
      backlight_compensation=${this.getBackLightComp()},` +
      this.getExposure() +
      `exposure_auto_priority=${this.camData.exposureAutoPriority},
      pan_absolute=${this.camData.panAbsolute},
      tilt_absolute=${this.camData.tiltAbsolute},` +
      this.getFocus() +
      `zoom_absolute=${this.camData.zoomAbsolute}`;

    this.settingsCommand =
      `v4l2-ctl -d ${Device} --set-ctrl ` + settings.replace(/\s/g, '');
    this.sendCameraSettings.emit(this.settingsCommand);
    this.dataService.setCamData(this.camData);
  }

  updateAutoSettings(): void {
    const { Device } = this.dataService.getConfigData();
    this.settingsCommand =
      `v4l2-ctl -d ${Device} --set-ctrl ` +
      `exposure_auto=` +
      (this.camData.exposureAuto ? 3 : 1) +
      `,white_balance_temperature_auto=` +
      (this.camData.whiteBalanceAuto ? 1 : 0) +
      `,focus_auto=` +
      (this.camData.focusAuto ? 1 : 0);
    this.sendCameraSettings.emit(this.settingsCommand);
    this.dataService.setCamData(this.camData);
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
  autoExposurePriorityToggle(toggle): void {
    this.camData.exposureAutoPriority = toggle.checked ? 1 : 0;
    this.updateCameraSettings();
  }
  getWhiteBalance(): string {
    return this.camData.whiteBalanceAuto
      ? ``
      : `white_balance_temperature=${this.camData.whiteBalanceTemp},`;
  }
  exposureAutoToggle(toggle): void {
    this.camData.exposureAuto = toggle.checked ? 1 : 0;
    this.updateExposureAuto();
  }
  updateExposureAuto(): void {
    const { Device } = this.dataService.getConfigData();
    this.settingsCommand =
      `v4l2-ctl -d ${Device} --set-ctrl ` +
      `exposure_auto=` +
      (this.camData.exposureAuto ? 3 : 1);
    this.sendCameraSettings.emit(this.settingsCommand);
    this.dataService.setCamData(this.camData);
  }
  whiteBalanceAutoToggle(toggle): void {
    this.camData.whiteBalanceAuto = toggle.checked ? 1 : 0;
    this.updateWhiteBalanceAuto();
  }
  backlightCompensationToggle(toggle): void {
    this.camData.backlightComp = toggle.checked ? 1 : 0;
  }
  updateWhiteBalanceAuto(): void {
    const { Device } = this.dataService.getConfigData();
    this.settingsCommand =
      `v4l2-ctl -d ${Device} --set-ctrl ` +
      `white_balance_temperature_auto=` +
      (this.camData.whiteBalanceAuto ? 1 : 0);

    this.sendCameraSettings.emit(this.settingsCommand);
    this.dataService.setCamData(this.camData);
  }
  updateFocusSettings(toggle): void {
    this.camData.focusAuto = toggle.checked ? 1 : 0;
    const { Device } = this.dataService.getConfigData();
    this.settingsCommand =
      `v4l2-ctl -d ${Device} --set-ctrl ` +
      `focus_auto=` +
      this.camData.focusAuto;
    this.sendCameraSettings.emit(this.settingsCommand);
    this.dataService.setCamData(this.camData);
  }
}
