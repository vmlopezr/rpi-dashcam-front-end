import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { SERVER_URL } from '../../environments/environment';
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
export interface ErrorLog {
  id: number;
  errorSource: string;
  errorMessage: string;
  timeStamp: string;
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
  recordingState: string;
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
  private isRecording: boolean;
  private getCameraData: GetFunctions;
  private updateCameraData: UpdateFunctions;
  private errorLogs: ErrorLog[];
  private theme: string;
  constructor(private http: HttpClient) {
    this.isRecording = false;
    this.theme = 'sunny';
    this.initializeCamFunctionLists();
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  retrieveSettingsDataFromDB(): Observable<any> {
    return this.http.get(
      // The listed IP address is the wlan0 address of the Raspberry Pi.
      // 'http://192.168.10.1:50000/app-settings/settings/data',

      // The listed IP is the local address used for development.
      // 'http://192.168.1.103:50000/app-settings/settings/data',
      SERVER_URL + '/app-settings/settings/data',
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
  getLogitechC920Data = (): void => {
    const { IPAddress, NodePort } = this.ConfigData;
    this.http
      .get(`http://${IPAddress}:${NodePort}/app-settings/logitechC920/data`)
      .subscribe((data: LogitechC920Data) => {
        this.camData = data;
      });
  };
  getLifeCamHD3000Data = (): void => {
    const { IPAddress, NodePort } = this.ConfigData;
    this.http
      .get(`http://${IPAddress}:${NodePort}/app-settings/mshd3000/data`)
      .subscribe((data: MSHD3000Data) => {
        this.camData = data;
      });
  };
  getDefaultCamData = (): void => {
    const { IPAddress, NodePort } = this.ConfigData;
    this.http
      .get(`http://${IPAddress}:${NodePort}/app-settings/defaultCam/data`)
      .subscribe((data: DefaultCamData) => {
        this.camData = data;
      });
  };
  getTheme = (): string => {
    return this.theme;
  };
  setTheme = (theme: string): void => {
    this.theme = theme;
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
  getErrorLogfromDB(): Observable<any> {
    const { IPAddress, NodePort } = this.getConfigData();
    return this.http.get(
      `http://${IPAddress}:${NodePort}/app-settings/errorlog/data/all`,
    );
  }
  clearErrorLogfromDB(): Observable<any> {
    const { IPAddress, NodePort } = this.getConfigData();
    return this.http.get(
      `http://${IPAddress}:${NodePort}/app-settings/errorlog/clear`,
    );
  }
  setErrorLog(errorLog: ErrorLog[]): void {
    this.errorLogs = errorLog;
  }
  getErrorLog(): ErrorLog[] {
    return this.errorLogs;
  }
  setIsRecording(value: boolean): void {
    this.isRecording = value;
  }
  getIsRecording(): boolean {
    return this.isRecording;
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
      whiteBalanceTemp: 44,
      sharpness: 128,
      exposureAbsolute: 12,
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
      whiteBalanceTemp: 23,
      sharpness: 25,
      backlightComp: 0,
      exposureAuto: 1,
      exposureAbsolute: 3,
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
