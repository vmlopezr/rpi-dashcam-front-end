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
  videoPath = '';
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private configService: ConfigService,
  ) {}
  getVideoPath(): string {
    const address = this.configService.getNodeAddress();
    const port = this.configService.getNodePort();
    const filename = this.route.snapshot.paramMap.get('vid');
    return `http://${address}:${port}/videos/showvideo/${filename}`;
  }
}
export { LocalStreamPage };
