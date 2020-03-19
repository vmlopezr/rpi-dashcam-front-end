import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../services/config.service';

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
    private route: ActivatedRoute,
    private configService: ConfigService,
  ) {
    this.videoPath = '';
    this.showVideo = true;
  }
  getVideoPath(): string {
    const address = this.configService.getNodeAddress();
    const port = this.configService.getNodePort();
    const filename = this.route.snapshot.paramMap.get('vid');
    return `http://${address}:${port}/videos/playvideo/${filename}`;
  }
  onExit(): void {
    this.showVideo = false;
  }
}
export { LocalStreamPage };
