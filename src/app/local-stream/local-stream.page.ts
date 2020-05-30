import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-local-stream',
  templateUrl: './local-stream.page.html',
  styleUrls: ['./local-stream.page.scss'],
})
class LocalStreamPage {
  videoPath: string;
  showVideo: boolean;
  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private route: ActivatedRoute,
  ) {
    this.videoPath = '';
    this.showVideo = true;
  }
  getVideoPath(): string {
    // const { IPAddress, NodePort } = this.dataService.getConfigData();
    // const filename = this.route.snapshot.paramMap.get('vid');
    return `assets/May_28_2020-02.12.19.AM.mp4`;
  }
  onExit(): void {
    this.showVideo = false;
  }
}
export { LocalStreamPage };