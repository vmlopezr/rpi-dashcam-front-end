import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

export interface MSHD3000Data {
  brightness: number;
  contrast: number;
  saturation: number;
  whiteBalanceAuto: boolean;
  powerFreq: number;
  whiteBalanceTemp: number;
  sharpness: number;
  backlightComp: number;
  exposureAuto: boolean;
  exposureAbsolute: number;
  panAbsolute: number;
  tiltAbsolute: number;
  zoomAbsolute: number;
}
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
@Injectable()
class DataService {
  private camData: CamData | MSHD3000Data;
  private camera: string;
  private videoLength: number;
  private isRecording: boolean;
  constructor() {
    this.isRecording = false;
    console.log('isrecording: ' + this.isRecording);
    this.camera = 'Logitech Webcam HD C920';
    this.videoLength = 30;
    this.camData = this.getDataDefaults(this.camera);
  }
  setIsRecording(value: boolean): void {
    this.isRecording = value;
  }
  getIsRecording(): boolean {
    return this.isRecording;
  }
  getVideoLength(): number {
    return this.videoLength;
  }
  setVideoLength(length: number): void {
    this.videoLength = length;
  }
  setCamera(camera: string): void {
    this.camera = camera;
  }
  getCamera(): string {
    return this.camera;
  }
  setCamData(camData: CamData | MSHD3000Data): void {
    this.camData = camData;
  }
  getData(): CamData | MSHD3000Data {
    return this.camData;
  }
  LogitechC920Defaults(): CamData {
    return {
      brightness: 128,
      contrast: 128,
      saturation: 128,
      gain: 0,
      whiteBalanceTemp: 4000,
      sharpness: 128,
      exposureAbsolute: 250,
      panAbsolute: 0,
      tiltAbsolute: 0,
      focusAbsolute: 0,
      zoomAbsolute: 100,
      powerFreq: 2,
      whiteBalanceAuto: true,
      exposureAuto: true,
      exposureAutoPriority: false,
      focusAuto: true,
      backlightComp: true,
    };
  }
  CameraDefault(): CamData {
    return {
      brightness: 128,
      contrast: 128,
      saturation: 128,
      gain: 0,
      whiteBalanceTemp: 4000,
      sharpness: 128,
      exposureAbsolute: 250,
      panAbsolute: 0,
      tiltAbsolute: 0,
      focusAbsolute: 0,
      zoomAbsolute: 100,
      powerFreq: 2,
      whiteBalanceAuto: true,
      exposureAuto: true,
      exposureAutoPriority: false,
      focusAuto: true,
      backlightComp: true,
    };
  }
  MSHD3000Defaults(): MSHD3000Data {
    return {
      brightness: 133,
      contrast: 5,
      saturation: 83,
      whiteBalanceAuto: true,
      powerFreq: 2,
      whiteBalanceTemp: 4500,
      sharpness: 25,
      backlightComp: 0,
      exposureAuto: true,
      exposureAbsolute: 156,
      panAbsolute: 0,
      tiltAbsolute: 0,
      zoomAbsolute: 0,
    };
  }
  getDataDefaults(camera: string): CamData | MSHD3000Data {
    if (camera === 'Logitech Webcam HD C920') {
      return this.LogitechC920Defaults();
    } else if (camera === 'Microsoft LifeCam HD-3000') {
      return this.MSHD3000Defaults();
    } else {
      return this.CameraDefault();
    }
  }
}
export { DataService };
