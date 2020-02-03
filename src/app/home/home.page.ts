import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { ConfigService } from '../services/config.service';
import * as attributes from '../../appconfig.json';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  userInput: '';
  NodeAddress: string;
  NodePort: number;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private alertController: AlertController,
  ) {
    configService.setNodePort(attributes.NodePort);
    configService.setNodeAddress(attributes.IPAddress);
    configService.setLiveStreamPort(attributes.Live_Stream_Port);
    configService.setDevice(attributes.Device);
    this.NodePort = configService.getNodePort();
    this.NodeAddress = configService.getNodeAddress();
  }

  ngOnInit(): void {}
  exit(): void {
    console.log('exiting');
  }
  download(): void {
    this.http
      .get(
        `http://${this.NodeAddress}:${this.NodePort}/rest/info/download/February_02_2020_10.11.04_AM`,
      )
      .subscribe();
  }
  startStreamServer(): void {
    this.http
      .get(`http://${this.NodeAddress}:${this.NodePort}/rest/info/start`)
      .subscribe();
    console.log('started server ' + window.location.href);
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
    console.log('shutting down');
    this.http
      .get(`http://${this.NodeAddress}:${this.NodePort}/rest/info/shutdown`)
      .subscribe();
  }
}
