import { Component, OnInit, NgZone } from '@angular/core';
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

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private zone: NgZone,
  ) {
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
  trackByFn(index: number, item: string): number {
    return index;
  }
  removeVideo(item): void {
    // Run zone for change detection as a item is deleted in the virtual scroll
    this.zone.run(() => {
      this.dirData.splice(this.dirData.indexOf(item), 1);
      this.dirData = [...this.dirData];
    });
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
