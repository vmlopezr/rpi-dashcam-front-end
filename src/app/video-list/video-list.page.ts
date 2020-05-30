import { Component, OnInit, ApplicationRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../services/data.service';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.page.html',
})
export class VideoListPage implements OnInit {
  @ViewChild(IonContent, { static: true }) content: IonContent;
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
  ionViewWillLeave(): void {
    this.saveScrollPos();
  }
  ionViewDidEnter = (): void => {
    const scrollPos = this.dataService.getScrollPosition();
    this.content.scrollToPoint(0, scrollPos, 200);
  };
  saveScrollPos = (): void => {
    this.content.getScrollElement().then(data => {
      this.dataService.setScrollPosition(data.scrollTop);
    });
  };
  removeVideo(item): void {
    // Change detection on item delete
    setTimeout(() => {
      this.dirData.splice(this.dirData.indexOf(item), 1);
      this.dirData = [...this.dirData];
      this.dataService.updateRecordings(this.dirData);
      this.app.tick();
    }, 0);
  }

  getDirs(): void {
    // const { IPAddress, NodePort } = this.dataService.getConfigData();
    // this.http
    //   .get(`http://${IPAddress}:${NodePort}/videos/dir`)
    //   .subscribe(res => {
    //     localStorage.setItem('dirData', JSON.stringify(res['data']));
    //     this.dirData = res['data'];
    //   });
    const files = this.dataService.getRecordings();
    localStorage.setItem('dirData', JSON.stringify(files));
    this.dirData = [...files];
  }
}
