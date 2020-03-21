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
  width: number;
  height: number;
  constructor(private dataService: DataService) {
    this.width = window.innerWidth;
    this.height = this.width - 100;
    //getData from DB
    this.camData = this.dataService.getData() as MSHD3000Data;
  }
  ngOnInit(): void {
    if (this.dataService.getIsRecording()) {
      this.updateAutoSettings();
    }
  }
  rotateVideoStream(toggle: { checked: number }): void {
    this.camData.verticalFlip = toggle.checked ? 1 : 0;
    this.rotateStream.emit(this.camData.verticalFlip.toString());
    this.dataService.setCamData(this.camData);
  }
  updateVideoLength(): void {
    this.sendVideoLength.emit(this.camData.videoLength.toString());
    this.dataService.setCamData(this.camData);
  }

  setDefault(): void {
    this.camData = this.dataService.getDataDefaults(
      this.dataService.getCamera(),
    ) as MSHD3000Data;
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
      backlight_compensation=${this.getBackLightComp()},` +
      this.getExposure() +
      `pan_absolute=${this.camData.panAbsolute},
      tilt_absolute=${this.camData.tiltAbsolute},` +
      `zoom_absolute=${this.camData.zoomAbsolute}`;

    const settingsCommand =
      `v4l2-ctl -d ${Device} --set-ctrl ` + settings.replace(/\s/g, '');
    this.sendCameraSettings.emit(settingsCommand);
    this.dataService.setCamData(this.camData);
  }
  updateAutoSettings(): void {
    const { Device } = this.dataService.getConfigData();

    const settingsCommand =
      `v4l2-ctl -d ${Device} --set-ctrl ` +
      `exposure_auto=` +
      (this.camData.exposureAuto ? 3 : 1) +
      `,white_balance_temperature_auto=` +
      (this.camData.whiteBalanceAuto ? 1 : 0);

    this.sendCameraSettings.emit(settingsCommand);
    this.dataService.setCamData(this.camData);
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

  updateExposureAuto(): void {
    const { Device } = this.dataService.getConfigData();
    const settingsCommand =
      `v4l2-ctl -d ${Device} --set-ctrl ` +
      `exposure_auto=` +
      (this.camData.exposureAuto ? 3 : 1);
    console.log('exposure auto: ' + this.camData.exposureAuto);
    this.sendCameraSettings.emit(settingsCommand);
    this.dataService.setCamData(this.camData);
  }
  exposureAutoToggle(toggle: { checked: boolean }): void {
    this.camData.exposureAuto = toggle.checked ? 1 : 0;
    this.updateExposureAuto();
  }
  whiteBalanceAutoToggle(toggle: { checked: boolean }): void {
    this.camData.whiteBalanceAuto = toggle.checked ? 1 : 0;
    this.updateWhiteBalanceAuto();
  }
  updateWhiteBalanceAuto(): void {
    const { Device } = this.dataService.getConfigData();
    const settingsCommand =
      `v4l2-ctl -d ${Device} --set-ctrl ` +
      `white_balance_temperature_auto=` +
      (this.camData.whiteBalanceAuto ? 1 : 0);
    console.log('white balance auto: ' + this.camData.whiteBalanceAuto);
    this.sendCameraSettings.emit(settingsCommand);
    this.dataService.setCamData(this.camData);
  }
}
