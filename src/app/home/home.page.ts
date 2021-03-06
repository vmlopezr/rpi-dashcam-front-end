import { Component, OnInit, ApplicationRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, ModalController } from '@ionic/angular';
import { DataService, AppSettings, ErrorLog } from '../services/data.service';
import { ErrorLogModal } from './error-log/ErrorLogModal.page';

const errorHeader = 'Python process error';
const errorMsg =
  `The python process has exited prematurely. An error may ` +
  `have occurred, the recent error logs for more detail.`;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isRecording: boolean;
  camImage: string;
  camList: string[];
  camera: string;
  showSpinner: boolean;
  theme: string;
  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private alertController: AlertController,
    private modalController: ModalController,
    private app: ApplicationRef,
  ) {}
  ngOnInit(): void {
    this.showSpinner = true;
    this.theme = this.dataService.getTheme();
    this.isRecording = this.dataService.getIsRecording();
    this.camList = [
      'Microsoft LifeCam HD-3000',
      'Logitech Webcam HD C920',
      'Default UVC Camera',
    ];
  }
  /** On page enter load the current camera data as well as error log data.*/
  ionViewWillEnter(): void {
    // Retrieve App settings data from the database
    this.dataService
      .retrieveSettingsDataFromDB()
      .subscribe((data: AppSettings) => {
        // Update the camera and locally store the data
        this.camera = data.camera;
        this.dataService.setData(data);

        // Check the current state of the python program
        this.dataService
          .checkIfPythonRunning()
          .subscribe((isRecording: boolean) => {
            // This situation happens if the python program exits when failing to open its socket
            if (this.isRecording === true && isRecording == false) {
              this.dataService.presentAlert(errorHeader, errorMsg);
            }
            // Update page state based on recordingState
            if (isRecording) {
              this.isRecording = true;
              this.dataService.setIsRecording(true);
            } else {
              this.isRecording = false;
              this.dataService.setIsRecording(false);
            }
            this.camImage = this.setCameraImage(isRecording);
          });

        // Retrieve error logs
        this.dataService.getErrorLogfromDB().subscribe((data: ErrorLog[]) => {
          this.dataService.setErrorLog(data);
          this.showSpinner = false;
        });

        // Retrieve camera settings
        this.dataService.retrieveCamDataFromDB(this.camera);
      });
  }
  /**
   * Update the app theme based on the value of the theme property.
   */
  updateTheme(): void {
    if (this.theme === 'sunny') {
      this.theme = 'moon';
      this.setLightTheme();
    } else {
      this.theme = 'sunny';
      this.setDarkTheme();
    }
  }
  /**
   * Set the theme to dark colors.
   */
  setDarkTheme(): void {
    document.documentElement.style.setProperty('--background-color', '#181818');
    document.documentElement.style.setProperty('--header-color', '#0b151db9');
    document.documentElement.style.setProperty(
      '--toggle-background',
      '#646464',
    );
    document.documentElement.style.setProperty(
      '--toggle-background-checked',
      '#1ab474',
    );
    document.documentElement.style.setProperty('--knob-bg', '#979797');
    document.documentElement.style.setProperty(
      '--range-background-disabled',
      '#838383',
    );
    document.documentElement.style.setProperty(
      '--range-background',
      '#0c0c0c75',
    );
    document.documentElement.style.setProperty(
      '--range-background-active',
      '#1480fba2',
    );
    document.documentElement.style.setProperty(
      '--input-background',
      '#0c0c0c75',
    );
    document.documentElement.style.setProperty(
      '--input-border-color',
      'transparent',
    );
    document.documentElement.style.setProperty(
      '--heading-font-color',
      '#d4d4d4',
    );
    document.documentElement.style.setProperty('--font-color', '#c5c5c5');
    document.documentElement.style.setProperty(
      '--control-section-bg',
      '#353333',
    );
    document.documentElement.style.setProperty(
      '--control-section-border',
      '#4b4b4b',
    );
    document.documentElement.style.setProperty('--button-bg', '#1480fba2');
    document.documentElement.style.setProperty(
      '--button-bg-hover',
      '#1480fb6e',
    );
    document.documentElement.style.setProperty(
      '--button-bg-activated',
      '#568bc0b2',
    );
    document.documentElement.style.setProperty('--button-color', '#d8dde2');
    document.documentElement.style.setProperty('--video-bg-options', '#424242');
    document.documentElement.style.setProperty(
      '--menu-label-hover-bg',
      '#838383',
    );
    document.documentElement.style.setProperty('--font-hover', '#4b4b4b');
    document.documentElement.style.setProperty('--image-background', '#858080');
    document.documentElement.style.setProperty('--table-header', '#3a3535');
    document.documentElement.style.setProperty('--table-row-bg', '#5e5d5d');
  }
  /**
   * Set the theme to a light color.
   */
  setLightTheme(): void {
    document.documentElement.style.setProperty('--background-color', '#ebebeb');
    document.documentElement.style.setProperty('--header-color', '#758797');
    document.documentElement.style.setProperty('--control-section-bg', '#fff');
    document.documentElement.style.setProperty(
      '--toggle-background',
      '#bebebe',
    );
    document.documentElement.style.setProperty(
      '--toggle-background-checked',
      '#1aafb4',
    );
    document.documentElement.style.setProperty(
      '--range-background-disabled',
      '#7e7e7e',
    );
    document.documentElement.style.setProperty('--range-background', '#b7e9eb');
    document.documentElement.style.setProperty(
      '--range-background-active',
      '#147efb',
    );
    document.documentElement.style.setProperty('--input-background', '#fff');
    document.documentElement.style.setProperty(
      '--input-border-color',
      '#494949',
    );
    document.documentElement.style.setProperty(
      '--heading-font-color',
      '#252525',
    );
    document.documentElement.style.setProperty('--font-color', '#494949');
    document.documentElement.style.setProperty('--button-bg', '#147efb');
    document.documentElement.style.setProperty(
      '--button-bg-hover',
      '#1480fb5d',
    );
    document.documentElement.style.setProperty(
      '--button-bg-activated',
      '#1480fb5d',
    );
    document.documentElement.style.setProperty('--button-color', '#fff');
    document.documentElement.style.setProperty(
      '--control-section-border',
      '#9f9f9f',
    );
    document.documentElement.style.setProperty('--knob-bg', '#ababab');
    document.documentElement.style.setProperty('--video-bg-options', '#fff');
    document.documentElement.style.setProperty(
      '--menu-label-hover-bg',
      '#d3d3d3',
    );
    document.documentElement.style.setProperty('--image-background', '#ebebeb');
    document.documentElement.style.setProperty('--table-header', '#aaa');
    document.documentElement.style.setProperty('--table-row-bg', '#fff');
  }
  /** On page exit save the current theme of the application.*/
  ionViewWillLeave(): void {
    this.dataService.setTheme(this.theme);
  }
  /** Update page state when recording is started.*/
  startRecording(): void {
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    this.isRecording = true;
    this.dataService.setIsRecording(true);
    this.camImage = `assets/CamOn/${this.camera}-on.png`;
    this.http
      .get(`http://${IPAddress}:${NodePort}/livestream/startRecording`)
      .subscribe();

    // Check if error has occurred after 1 second
    setTimeout(() => {
      this.dataService
        .checkIfPythonRunning()
        .subscribe((isRecording: boolean) => {
          if (isRecording == false) {
            this.dataService.presentAlert(errorHeader, errorMsg);
            this.dataService.setIsRecording(false);
            this.isRecording = false;
            this.camImage = this.setCameraImage(false);
            // Retrieve error logs
            this.dataService
              .getErrorLogfromDB()
              .subscribe((data: ErrorLog[]) => {
                this.dataService.setErrorLog(data);
                this.showSpinner = false;
              });
            this.app.tick();
          }
        });
    }, 1500);
  }
  /** Update page state when recording is stopped. */
  stopRecording(): void {
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    this.isRecording = false;
    this.dataService.setIsRecording(false);
    this.camImage = `assets/CamOff/${this.camera}-off.png`;
    this.http
      .get(`http://${IPAddress}:${NodePort}/livestream/stopRecording`)
      .subscribe();
  }
  /** Open modal to display error logs. */
  async showErrorLog(): Promise<void> {
    const modal = await this.modalController.create({
      component: ErrorLogModal,
      cssClass: 'my-modal',
    });
    return await modal.present();
  }
  /** Choose the camera image on the home page based on recordingState.
   * @param {boolean} isRecording - Recording state of the camera.
   */
  setCameraImage(isRecording: boolean): string {
    if (isRecording) {
      return `assets/CamOn/${this.camera}-on.png`;
    } else {
      return `assets/CamOff/${this.camera}-off.png`;
    }
  }
  /** Update the camera image and stop the loading spinner.*/
  selectionChange(): void {
    // Note: this.camera is two-way bounded. The functions use the new value.
    this.camImage = this.setCameraImage(this.isRecording);
    this.dataService.updateCamera(this.camera);
    if (!this.showSpinner) this.dataService.retrieveCamDataFromDB(this.camera);
  }
  /** Communicate to the back-end server to start the livestream socket.*/
  startStreamServer(): void {
    if (this.isRecording) {
      const { IPAddress, NodePort } = this.dataService.getConfigData();
      this.http
        .get(`http://${IPAddress}:${NodePort}/livestream/start`)
        .subscribe();
    }
  }
  /** Show alert when shutdown button is pressed. */
  async shutDownConfirm(): Promise<void> {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: 'Warning',
      message: 'RaspberryPi will shutdown. Are you sure?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Shutdown',
          handler: () => {
            this.shutDown();
          },
        },
      ],
    });
    await alert.present();
  }
  /** Shutdown actions for the process. */
  shutDown(): void {
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    this.http
      .get(`http://${IPAddress}:${NodePort}/livestream/shutdown`)
      .subscribe();
  }
}
