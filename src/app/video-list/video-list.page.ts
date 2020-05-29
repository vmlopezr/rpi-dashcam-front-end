import { Component, OnInit, ApplicationRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.page.html',
})
export class VideoListPage implements OnInit {
  dirData: string[];
  storageDirectory = '';

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private app: ApplicationRef,
  ) {
    const cache = localStorage.getItem('dirData');
    if (cache) {
      this.dirData = JSON.parse(cache);
    }
  }
  ngOnInit(): void {
    // on gh-pages branch, give dummy array and link to sample video
    this.getDirs();
  }
  addRow(): void {
    this.dirData.push('new');
  }
  trackByFn(index: number, item: string): number {
    return index;
  }
  ionViewDidEnter(): void {
    this.app.tick();
  }
  removeVideo(item): void {
    // Change detection on item delete
    setTimeout(() => {
      this.dirData.splice(this.dirData.indexOf(item), 1);
      this.dirData = [...this.dirData];
      this.app.tick();
    }, 0);
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
