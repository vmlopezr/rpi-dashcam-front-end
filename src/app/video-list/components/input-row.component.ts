import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../services/config.service';
@Component({
  selector: 'app-input-row',
  templateUrl: './input-row.component.html',
  styleUrls: ['./input-row.component.scss'],
})
export class InputRowComponent implements OnInit {
  @Input() data: string;
  @Input() index: number;
  @Output() deleteEvent = new EventEmitter<number>();
  thumbnail: string;
  titleDisplayed: string;
  videoPath: string;
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    public alertController: AlertController,
  ) {}

  ngOnInit(): void {
    this.thumbnail =
      'http://' +
      this.configService.getNodeAddress() +
      ':' +
      this.configService.getNodePort() +
      '/rest/info/thumbnail/' +
      this.data.substr(0, this.data.lastIndexOf('.')) +
      '.jpg';
    this.processImageTitle();
    this.videoPath = '/local-stream/' + this.data;
  }
  deleteFile(): void {
    const APIPath =
      `http://${this.configService.getNodeAddress()}` +
      `:${this.configService.getNodePort()}/rest/info/delete/` +
      this.data.substr(0, this.data.lastIndexOf('.'));
    // console.log(this.index + ' ' + this.data);
    this.deleteEvent.emit(this.index);
    this.http.get(APIPath).subscribe();
  }
  // downloadPress(): void {
  //   const path = this.file.externalApplicationStorageDirectory;
  //   const APIPath =
  //     `http://${this.configService.getNodeAddress()}` +
  //     `:${this.configService.getNodePort()}/rest/info/download/` +
  //     this.data.substr(0, this.data.lastIndexOf('.'));

  //   console.log('pressed download');
  //   // this.http.get(APIPath).subscribe();
  //   const transfer = this.transfer.create();
  //   transfer.download(APIPath, path + this.data);
  // }
  async deleteAlertConfirm(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Warning',
      message: 'Video will be deleted. Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteFile();
          },
        },
      ],
    });

    await alert.present();
  }
  processImageTitle(): void {
    this.titleDisplayed = this.data
      .substr(0, this.data.lastIndexOf('.'))
      .replace(/_/g, ' ');
    this.titleDisplayed = this.titleDisplayed.replace(/\./g, ':');
  }
}

export class InputRow {}
