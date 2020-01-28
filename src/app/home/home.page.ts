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
  NodeAddress: string;
  NodePort: number;

  constructor(private http: HttpClient, private configService: ConfigService) {
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
  startStreamServer(): void {
    // this.http
    //   .get(`http://${this.NodeAddress}:${this.NodePort}/rest/info/start`)
    //   .subscribe();
    console.log('started server ' + window.location.href);
  }
}
