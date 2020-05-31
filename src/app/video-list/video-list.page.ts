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
  trackByFn(index: number, item: string): number {
    return index;
  }
  /** On page exit save the current scroll position.*/
  ionViewWillLeave(): void {
    this.saveScrollPos();
  }
  /** On page enter move the scroll to the previous scroll postiion.*/
  ionViewDidEnter = (): void => {
    const scrollPos = this.dataService.getScrollPosition();
    this.content.scrollToPoint(0, scrollPos, 200);
  };
  /** Retrieve the current scroll position, and save it to the data service.*/
  saveScrollPos = (): void => {
    this.content.getScrollElement().then(data => {
      this.dataService.setScrollPosition(data.scrollTop);
    });
  };
  /** Remove a video from the list, and send command to the back-end to delete the video.backdrop-no-scroll
   * This will additionally run tick to update the display.
   */
  removeVideo(item): void {
    // Change detection on item delete
    setTimeout(() => {
      this.dirData.splice(this.dirData.indexOf(item), 1);
      this.dirData = [...this.dirData];
      this.app.tick();
    }, 0);
  }
  /** Get a list of videos recorded by the back-end server.*/
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
