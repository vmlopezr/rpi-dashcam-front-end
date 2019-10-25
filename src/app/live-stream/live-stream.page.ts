import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as io from 'socket.io-client';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-live-stream',
  templateUrl: './live-stream.page.html',
  styleUrls: ['./live-stream.page.scss'],
})
export class LiveStreamPage implements OnInit {
  imgSrc: string;
  socket: any;
  image: SafeUrl;
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private configService: ConfigService,
  ) {
    // this.imgSrc =
    //   '/home/vmlopez336/Documents/Web-Dev/Dashcam/Dash_Cam_Server/data/Thumbnail/loading.jpg';
    this.imgSrc = './data/Thumbnail/loading.jpg';
    this.socket = io.connect(
      'http://' +
        this.configService.getNodeAddress() +
        ':' +
        this.configService.getLiveStreamPort(),
    );
    console.log(
      'connecting to: ' +
        'http://' +
        this.configService.getNodeAddress() +
        ':' +
        this.configService.getLiveStreamPort(),
    );
    this.updateImage();
  }

  ngOnInit(): void {}

  stopStreamServer(): void {
    this.http
      .get(
        'http://' +
          this.configService.getNodeAddress() +
          ':' +
          this.configService.getNodePort() +
          '/rest/info/stop',
      )
      .subscribe();
    this.socket.destroy();
    console.log('stopped the streaming server');
  }
  updateImage(): void {
    this.socket.on('image', data => {
      this.imgSrc = 'data:image/jpeg;base64, ' + data.toString('base64');
    });
  }
  getImgContent(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.imgSrc);
  }
}
