import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, ModalController } from '@ionic/angular';
import { DataService, AppSettings, ErrorLog } from '../services/data.service';
import { ErrorLogModal } from './error-log/ErrorLogModal.page';

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
  updateTheme(): void {
    if (this.theme === 'sunny') {
      this.theme = 'moon';
      this.setLightTheme();
    } else {
      this.theme = 'sunny';
      this.setDarkTheme();
    }
  }
  setDarkTheme(): void {
    document.documentElement.style.setProperty('--background-color', '#181818');
    document.documentElement.style.setProperty('--header-color', '#0b151db9');
    document.documentElement.style.setProperty(
      '--toggle-background',
      '#bebebe',
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
      '#5c5b5b',
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
    document.documentElement.style.setProperty('--table-header', '#868686');
    document.documentElement.style.setProperty('--table-row-bg', '#fff');
  }
  ionViewWillLeave(): void {
    this.dataService.setTheme(this.theme);
  }
  ionViewWillEnter(): void {
    this.dataService
      .retrieveSettingsDataFromDB()
      .subscribe((data: AppSettings) => {
        this.camera = data.camera;
        this.dataService.setData(data);
        if (data.recordingState === 'ON') {
          this.isRecording = true;
          this.dataService.setIsRecording(true);
        } else {
          this.isRecording = false;
          this.dataService.setIsRecording(false);
        }
        this.camImage = this.setCameraImage(this.isRecording);
        this.dataService.getErrorLogfromDB().subscribe((data: ErrorLog[]) => {
          this.dataService.setErrorLog(data);
          this.showSpinner = false;
        });
        this.dataService.retrieveCamDataFromDB(this.camera);
      });
  }
  startRecording(): void {
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    this.isRecording = true;
    this.dataService.setIsRecording(true);
    this.camImage = `assets/CamOn/${this.camera}-on.png`;
    this.http
      .get(`http://${IPAddress}:${NodePort}/livestream/startRecording`)
      .subscribe();
  }
  stopRecording(): void {
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    this.isRecording = false;
    this.dataService.setIsRecording(false);
    this.camImage = `assets/CamOff/${this.camera}-off.png`;
    this.http
      .get(`http://${IPAddress}:${NodePort}/livestream/stopRecording`)
      .subscribe();
  }
  getErrorLog(): void {
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    this.http
      .get(`http://${IPAddress}:${NodePort}/app-settings/errorlog/data/all`)
      .subscribe((data: ErrorLog[]) => {
        console.log(data);
      });
  }
  async showErrorLog(): Promise<void> {
    const modal = await this.modalController.create({
      component: ErrorLogModal,
      cssClass: 'my-modal',
    });
    return await modal.present();
  }

  setCameraImage(value: boolean): string {
    if (this.isRecording) {
      return `assets/CamOn/${this.camera}-on.png`;
    } else {
      return `assets/CamOff/${this.camera}-off.png`;
    }
  }
  selectionChange(): void {
    // Note: this.camera is two-way bounded. The functions use the new value.
    this.camImage = this.setCameraImage(this.isRecording);
    this.dataService.updateCamera(this.camera);
    if (!this.showSpinner) this.dataService.retrieveCamDataFromDB(this.camera);
  }
  startStreamServer(): void {
    if (this.isRecording) {
      const { IPAddress, NodePort } = this.dataService.getConfigData();
      this.http
        .get(`http://${IPAddress}:${NodePort}/livestream/start`)
        .subscribe();
    }
  }
  async shutDownConfirm(): Promise<void> {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: 'Warning',
      message: 'RaspberryPi will shutdown. Are you sure?',
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
  shutDown(): void {
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    this.http
      .get(`http://${IPAddress}:${NodePort}/videos/shutdown`)
      .subscribe();
  }
}
