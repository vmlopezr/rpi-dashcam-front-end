import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
export interface MSHD3000Data {
  brightness: number;
  contrast: number;
  saturation: number;
  whiteBalanceAuto: number;
  powerFreq: number;
  whiteBalanceTemp: number;
  sharpness: number;
  backlightComp: number;
  exposureAuto: number;
  exposureAbsolute: number;
  panAbsolute: number;
  tiltAbsolute: number;
  zoomAbsolute: number;
  videoLength: number;
  verticalFlip: number;
}
export interface LogitechC920Data {
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
  exposureAuto: number;
  whiteBalanceAuto: number;
  exposureAutoPriority: number;
  focusAuto: number;
  backlightComp: number;
  videoLength: number;
  verticalFlip: number;
}
export interface DefaultCamData {
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
  exposureAuto: number;
  whiteBalanceAuto: number;
  exposureAutoPriority: number;
  focusAuto: number;
  backlightComp: number;
  videoLength: number;
  verticalFlip: number;
}
export interface AppSettings {
  id: number;
  camera: string;
  Device: string;
  NodePort: number;
  IPAddress: string;
  TCPStreamPort: number;
  LiveStreamPort: number;
  videoLength: number;
}
interface GetFunctions {
  'Microsoft LifeCam HD-3000': () => void;
  'Logitech Webcam HD C920': () => void;
  default: () => void;
}
interface UpdateFunctions {
  'Microsoft LifeCam HD-3000': () => void;
  'Logitech Webcam HD C920': () => void;
  default: () => void;
}
@Injectable()
class DataService {
  private ConfigData: AppSettings;
  private camData: LogitechC920Data | MSHD3000Data | DefaultCamData;
  private videoLength: number;
  private isRecording: boolean;
  private getCameraData: GetFunctions;
  private updateCameraData: UpdateFunctions;
  constructor(private http: HttpClient) {
    this.isRecording = false;
    this.initializeCamFunctionLists();
    this.videoLength = 30;
  }
  retrieveCamDataFromDB(camera: string): void {
    if (
      camera !== 'Microsoft LifeCam HD-3000' &&
      camera !== 'Logitech Webcam HD C920'
    ) {
      this.getCameraData['default']();
    } else {
      this.getCameraData[camera]();
    }
  }
  initializeCamFunctionLists(): void {
    this.getCameraData = {
      'Microsoft LifeCam HD-3000': this.getLifeCamHD3000Data,
      'Logitech Webcam HD C920': this.getLogitechC920Data,
      default: this.getDefaultCamData,
    };
    this.updateCameraData = {
      'Microsoft LifeCam HD-3000': this.updateLifeCamHD3000Data,
      'Logitech Webcam HD C920': this.updateLogitechC920Data,
      default: this.updateDefaultCamData,
    };
  }
  getLogitechC920Data = (): void => {
    const { IPAddress, NodePort } = this.ConfigData;
    this.http
      .get(`http://${IPAddress}:${NodePort}/app-settings/logitechC920/data`)
      .subscribe(data => {
        this.camData = data[0];
      });
  };
  getLifeCamHD3000Data = (): void => {
    const { IPAddress, NodePort } = this.ConfigData;
    this.http
      .get(`http://${IPAddress}:${NodePort}/app-settings/mshd3000/data`)
      .subscribe(data => {
        this.camData = data[0];
      });
  };
  getDefaultCamData = (): void => {
    const { IPAddress, NodePort } = this.ConfigData;
    this.http
      .get(`http://${IPAddress}:${NodePort}/app-settings/defaultCam/data`)
      .subscribe(data => {
        this.camData = data[0];
      });
  };
  updateCameraDataDB(): void {
    const camera = this.ConfigData.camera;
    if (
      camera !== 'Microsoft LifeCam HD-3000' &&
      camera !== 'Logitech Webcam HD C920'
    ) {
      this.updateCameraData['default']();
    } else {
      this.updateCameraData[camera]();
    }
    this.updateInitialVideoLength();
  }
  updateLogitechC920Data = (): void => {
    const { IPAddress, NodePort } = this.ConfigData;
    this.http
      .put(
        `http://${IPAddress}:${NodePort}/app-settings/logitechC920/update`,
        this.camData,
      )
      .subscribe();
  };
  updateLifeCamHD3000Data = (): void => {
    const { IPAddress, NodePort } = this.ConfigData;
    console.log(this.camData);
    this.http
      .put(
        `http://${IPAddress}:${NodePort}/app-settings/mshd3000/update`,
        this.camData,
      )
      .subscribe();
  };
  updateDefaultCamData = (): void => {
    const { IPAddress, NodePort } = this.ConfigData;
    this.http
      .put(
        `http://${IPAddress}:${NodePort}/app-settings/defaultCam/update`,
        this.camData,
      )
      .subscribe();
  };
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
    this.ConfigData.camera = camera;
  }
  setCamData(camData: LogitechC920Data | MSHD3000Data | DefaultCamData): void {
    this.camData = camData;
  }
  getData(): LogitechC920Data | MSHD3000Data | DefaultCamData {
    return this.camData;
  }
  LogitechC920Defaults(): Partial<LogitechC920Data> {
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
      whiteBalanceAuto: 1,
      exposureAuto: 1,
      exposureAutoPriority: 0,
      focusAuto: 1,
      backlightComp: 1,
      verticalFlip: 0,
      videoLength: 30,
    };
  }
  CameraDefault(): Partial<LogitechC920Data> {
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
      whiteBalanceAuto: 1,
      exposureAuto: 1,
      exposureAutoPriority: 0,
      focusAuto: 1,
      backlightComp: 1,
      verticalFlip: 0,
      videoLength: 30,
    };
  }
  MSHD3000Defaults(): Partial<MSHD3000Data> {
    return {
      brightness: 133,
      contrast: 5,
      saturation: 83,
      whiteBalanceAuto: 1,
      powerFreq: 2,
      whiteBalanceTemp: 4500,
      sharpness: 25,
      backlightComp: 0,
      exposureAuto: 1,
      exposureAbsolute: 156,
      panAbsolute: 0,
      tiltAbsolute: 0,
      zoomAbsolute: 0,
      verticalFlip: 0,
      videoLength: 30,
    };
  }
  getDataDefaults(
    camera: string,
  ):
    | Partial<LogitechC920Data>
    | Partial<MSHD3000Data>
    | Partial<DefaultCamData> {
    if (camera === 'Logitech Webcam HD C920') {
      return this.LogitechC920Defaults();
    } else if (camera === 'Microsoft LifeCam HD-3000') {
      return this.MSHD3000Defaults();
    } else {
      return this.CameraDefault();
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  retrieveDataFromDB(): Observable<any> {
    return this.http.get(
      'http://192.168.1.98:50000/app-settings/settings/data',
    );
  }
  updateCamera(camera: string): void {
    const { IPAddress, NodePort } = this.ConfigData;
    this.ConfigData.camera = camera;
    this.http
      .put(`http://${IPAddress}:${NodePort}/app-settings/settings/update`, {
        camera: camera,
      })
      .subscribe();
  }
  updateInitialVideoLength(): void {
    const { IPAddress, NodePort } = this.ConfigData;
    this.http
      .put(`http://${IPAddress}:${NodePort}/app-settings/settings/update`, {
        videoLength: this.camData.videoLength,
      })
      .subscribe();
  }
  setData(data: AppSettings): void {
    this.ConfigData = data;
  }
  getCamera(): string {
    return this.ConfigData.camera;
  }
  getConfigData(): AppSettings {
    return this.ConfigData;
  }
  getDevice(): string {
    return this.ConfigData.Device;
  }
}
export { DataService };
