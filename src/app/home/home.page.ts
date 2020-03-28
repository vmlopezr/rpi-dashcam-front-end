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

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private alertController: AlertController,
    private modalController: ModalController,
  ) {}
  ngOnInit(): void {
    this.showSpinner = true;

    this.isRecording = this.dataService.getIsRecording();

    this.camList = [
      'Microsoft LifeCam Cinema',
      'Microsoft LifeCam HD-5000',
      'Microsoft LifeCam VX-700',
      'Microsoft LifeCam Studio',
      'Microsoft LifeCam HD-3000',
      'Logitech Webcam C200',
      'Logitech Webcam C210',
      'Logitech Webcam C250',
      'Logitech Webcam HD C270',
      'Logitech Webcam HD C310',
      'Logitech Webcam C600',
      'Logitech Webcam HD C525',
      'Logitech Webcam HD C615',
      'Logitech Webcam C905',
      'Logitech Webcam HD C910',
      'Logitech Webcam HD C920',
      'Logitech Quickcam Pro 5000',
      'Logitech Quickcam Pro 9000',
    ];
  }
  ionViewWillEnter(): void {
    this.dataService.retrieveDataFromDB().subscribe((data: AppSettings) => {
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
      header: 'Warning',
      message: 'RaspberryPi will shutdown. Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
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
