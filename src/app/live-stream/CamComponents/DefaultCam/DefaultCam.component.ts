import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DefaultCamData, DataService } from '../../../services/data.service';

@Component({
  selector: 'DefaultCam',
  templateUrl: './DefaultCam.component.html',
})
export class DefaultCam {
  @Output() sendCameraSettings = new EventEmitter<string>();
  @Output() sendVideoLength = new EventEmitter<string>();
  @Output() rotateStream = new EventEmitter<string>();
  camData: DefaultCamData;
  videoLength: string;
  camera: string;
  constructor(private dataService: DataService) {
    this.camera = this.dataService.getCamera();
    this.camData = this.dataService.getData() as DefaultCamData;
    this.videoLength = this.camData.videoLength.toString();
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
    ) as DefaultCamData;
    this.videoLength = this.camData.videoLength.toString();
  }
  rotateVideoStream(toggle: boolean): void {
    if ((toggle ? 1 : 0) !== this.camData.verticalFlip) {
      this.camData.verticalFlip = toggle ? 1 : 0;
      this.rotateStream.emit(this.camData.verticalFlip.toString());
      this.dataService.setCamData(this.camData);
    }
  }
}
