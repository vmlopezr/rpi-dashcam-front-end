import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { ConfigService } from '../services/config.service';
import * as attributes from '../../appconfig.json';
import { StreamService } from '../services/streaming.service';
import { Storage } from '@ionic/storage';
import { DataService } from '../services/data.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isRecording: boolean;
  camImage: string;
  camList: string[];
  camera: string;
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private dataService: DataService,
    private alertController: AlertController,
    private storage: Storage,
  ) {
    this.camera = this.dataService.getCamera();
    configService.setNodePort(attributes.NodePort);
    configService.setNodeAddress(attributes.IPAddress);
    configService.setLiveStreamPort(attributes.Live_Stream_Port);
    configService.setDevice(attributes.Device);
    this.isRecording = this.dataService.getIsRecording();
    this.camImage = this.setCameraImage(this.isRecording);

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
  startRecording(): void {
    const address = this.configService.getNodeAddress();
    const port = this.configService.getNodePort();
    this.isRecording = true;
    this.dataService.setIsRecording(true);
    this.camImage = 'assets/CamOn/' + this.camera + '-on.png';
    this.http
      .get(`http://${address}:${port}/livestream/startRecording`)
      .subscribe();
  }
  stopRecording(): void {
    const address = this.configService.getNodeAddress();
    const port = this.configService.getNodePort();
    this.isRecording = false;
    this.dataService.setIsRecording(false);
    this.camImage = 'assets/CamOff/' + this.camera + '-off.png';
    this.http
      .get(`http://${address}:${port}/livestream/stopRecording`)
      .subscribe();
  }
  setCameraImage(value: boolean): string {
    if (this.isRecording) {
      return 'assets/CamOn/' + this.camera + '-on.png';
    } else {
      return 'assets/CamOff/' + this.camera + '-off.png';
    }
  }
  selectionChange(): void {
    this.camImage = this.setCameraImage(this.isRecording);
    this.dataService.setCamera(this.camera);
    //update with the current values in database
    this.dataService.setCamData(this.dataService.getDataDefaults(this.camera));
  }
  startStreamServer(): void {
    if (this.isRecording) {
      const address = this.configService.getNodeAddress();
      const port = this.configService.getNodePort();
      this.http.get(`http://${address}:${port}/livestream/start`).subscribe();
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
    const address = this.configService.getNodeAddress();
    const port = this.configService.getNodePort();
    this.http.get(`http://${address}:${port}/livestream/shutdown`).subscribe();
  }
}
