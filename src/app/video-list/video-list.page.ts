import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.page.html',
  styleUrls: ['./video-list.page.scss'],
})
export class VideoListPage implements OnInit {
  dirData: string[];
  storageDirectory = '';

  constructor(private http: HttpClient, private dataService: DataService) {
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
    this.dirData.splice(event, 1);
  }
  getDirs(): void {
    const { IPAddress, NodePort } = this.dataService.getConfigData();
    this.http
      .get(`http://${IPAddress}:${NodePort}/videos/dir`)
      .subscribe(res => {
        localStorage.setItem('dirData', JSON.stringify(res['data']));
        this.dirData = res['data'];
      });
  }
}
