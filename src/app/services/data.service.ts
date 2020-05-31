/* eslint-disable @typescript-eslint/no-explicit-any */
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
  private scrollPosition: number;
  constructor(private http: HttpClient) {
    this.isRecording = false;
    this.theme = 'sunny';
    this.scrollPosition = 0;
    this.initializeCamFunctionLists();
  }
  /** Run callback functions based on camera name input. */
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
  /** Iniailize an array with callback functions used to retrieve database data
   * depending on the camera name.
   */
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
    return this.http.get(SERVER_URL + '/app-settings/settings/data');
  }
  /** Save the scroll position from the video list page. */
  setScrollPosition(pos: number): void {
    this.scrollPosition = pos;
  }
  /** Return the scroll position from the video list page.*/
  getScrollPosition(): number {
    return this.scrollPosition;
  }
  /** Send application settings data to the back-end for database updates.*/
  updateCamera(camera: string): void {
    const { IPAddress, NodePort } = this.ConfigData;
    this.ConfigData.camera = camera;
    this.http
      .put(`http://${IPAddress}:${NodePort}/app-settings/settings/update`, {
        camera: camera,
      })
      .subscribe();
  }
  /** Retrieve Logitech C920 settings from database. */
  getLogitechC920Data = (): void => {
    const { IPAddress, NodePort } = this.ConfigData;
    this.http
      .get(`http://${IPAddress}:${NodePort}/app-settings/logitechC920/data`)
      .subscribe((data: LogitechC920Data) => {
        this.camData = data;
      });
  };
  /** Retrieve Lifecam HD3000 settings from database. */
  getLifeCamHD3000Data = (): void => {
    const { IPAddress, NodePort } = this.ConfigData;
    this.http
      .get(`http://${IPAddress}:${NodePort}/app-settings/mshd3000/data`)
      .subscribe((data: MSHD3000Data) => {
        this.camData = data;
      });
  };
  /** Retrieve default camera settings from database.*/
  getDefaultCamData = (): void => {
    const { IPAddress, NodePort } = this.ConfigData;
    this.http
      .get(`http://${IPAddress}:${NodePort}/app-settings/defaultCam/data`)
      .subscribe((data: DefaultCamData) => {
        this.camData = data;
      });
  };
  /** Send the current theme of the application. */
  getTheme = (): string => {
    return this.theme;
  };
  /** Save the current save of the application. */
  setTheme = (theme: string): void => {
    this.theme = theme;
  };
  /** Run function from callback array based on camera name.*/
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
  /** Update Logitech C920 camera settings in the databse. */
  updateLogitechC920Data = (): void => {
    const { IPAddress, NodePort } = this.ConfigData;
    this.http
      .put(
        `http://${IPAddress}:${NodePort}/app-settings/logitechC920/update`,
        this.camData,
      )
      .subscribe();
  };
  /** Update Lifecam HD3000 camera settings in the databse. */
  updateLifeCamHD3000Data = (): void => {
    const { IPAddress, NodePort } = this.ConfigData;
    this.http
      .put(
        `http://${IPAddress}:${NodePort}/app-settings/mshd3000/update`,
        this.camData,
      )
      .subscribe();
  };
  /** Update default camera data in the database.*/
  updateDefaultCamData = (): void => {
    const { IPAddress, NodePort } = this.ConfigData;
    this.http
      .put(
        `http://${IPAddress}:${NodePort}/app-settings/defaultCam/update`,
        this.camData,
      )
      .subscribe();
  };
  /** Receive error log data from the database*/
  getErrorLogfromDB(): Observable<any> {
    const { IPAddress, NodePort } = this.getConfigData();
    return this.http.get(
      `http://${IPAddress}:${NodePort}/app-settings/errorlog/data/all`,
    );
  }
  /** Erase the error log data in the database. */
  clearErrorLogfromDB(): Observable<any> {
    const { IPAddress, NodePort } = this.getConfigData();
    return this.http.get(
      `http://${IPAddress}:${NodePort}/app-settings/errorlog/clear`,
    );
  }
  /** Save the error data for display in the modal. */
  setErrorLog(errorLog: ErrorLog[]): void {
    this.errorLogs = errorLog;
  }
  /** Return the error log data stored in the service.*/
  getErrorLog(): ErrorLog[] {
    return this.errorLogs;
  }
  /** Update recording state.*/
  setIsRecording(value: boolean): void {
    this.isRecording = value;
  }
  /** Return recording state.*/
  getIsRecording(): boolean {
    return this.isRecording;
  }
  /** Save the current camera name. */
  setCamera(camera: string): void {
    this.ConfigData.camera = camera;
  }
  /** Save the camera settings received from the livestream page. */
  setCamData(camData: LogitechC920Data | MSHD3000Data | DefaultCamData): void {
    this.camData = camData;
  }
  /** Return the camera settings saved in the data service.*/
  getData(): LogitechC920Data | MSHD3000Data | DefaultCamData {
    return this.camData;
  }
  /** Return default settings for the logitechC920 camera.*/
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
      videoLength: 300,
    };
  }
  /** Return default settings for default camera.*/
  CameraDefault(): Partial<LogitechC920Data> {
    return {
      verticalFlip: 0,
      videoLength: 300,
    };
  }
  /** Return default settings for the Lifecam HD3000*/
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
      videoLength: 300,
    };
  }
  /** Return camera defaults based on the current camera name. */
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
    } else return this.CameraDefault();
  }
  /** Update app settings data stored in the data service. */
  setData(data: AppSettings): void {
    this.ConfigData = data;
  }
  /** Return current camera name saved in the data service.*/
  getCamera(): string {
    return this.ConfigData.camera;
  }
  /** Return app settings data stored in the data service.*/
  getConfigData(): AppSettings {
    return this.ConfigData;
  }
  /** Return usb device name stored in the data service.*/
  getDevice(): string {
    return this.ConfigData.Device;
  }
}
export { DataService };
