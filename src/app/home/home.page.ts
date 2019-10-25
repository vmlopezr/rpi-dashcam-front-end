import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../services/config.service';
import * as attributes from '../../appconfig.json';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  userInput: '';
  nodePort: number;
  address: string;
  liveStreamport: number;
  constructor(private http: HttpClient, private configService: ConfigService) {
    configService.setNodePort(attributes.node_port);
    configService.setNodeAddress(attributes.ip_address);
    configService.setLiveStreamPort(attributes.Live_Stream_Port);
  }

  ngOnInit(): void {}

  saveData(): void {
    this.http
      .post(
        'http://' +
          this.configService.getNodeAddress() +
          ':' +
          this.configService.getNodePort() +
          '/rest/info/save',
        { name: this.userInput },
      )
      .subscribe(res => {
        console.log('res:', res);
      });
    console.log('done...');
  }
  startStreamServer(): void {
    this.http
      .get(
        'http://' +
          this.configService.getNodeAddress() +
          ':' +
          this.configService.getNodePort() +
          '/rest/info/start',
      )
      .subscribe();
    console.log('started server');
  }
}
