import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.page.html',
  styleUrls: ['./video-list.page.scss'],
})
export class VideoListPage implements OnInit {
  dirData: string[];
  storageDirectory = '';

  constructor(private http: HttpClient, private configService: ConfigService) {
    const cache = localStorage.getItem('dirData');
    if (cache) {
      this.dirData = JSON.parse(cache);
    }
  }
  ngOnInit(): void {
    this.getDirs();
  }
  addRow(): void {
    this.dirData.push('new');
  }
  removeVideo(event): void {
    console.log('function in parent ' + event);
    this.dirData.splice(event, 1);
  }
  getDirs(): void {
    this.http
      .get(
        'http://' +
          this.configService.getNodeAddress() +
          ':' +
          this.configService.getNodePort() +
          '/rest/info/dir',
      )
      .subscribe(res => {
        localStorage.setItem('dirData', JSON.stringify(res['data']));
        this.dirData = res['data'];
      });
  }
}
