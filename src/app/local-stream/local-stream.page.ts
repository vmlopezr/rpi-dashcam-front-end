import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-local-stream',
  templateUrl: './local-stream.page.html',
  styleUrls: ['./local-stream.page.scss'],
})
class LocalStreamPage implements OnInit {
  videoPath = '';
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private configService: ConfigService,
  ) {
    this.videoPath =
      'http://' +
      this.configService.getNodeAddress() +
      ':' +
      this.configService.getNodePort() +
      '/rest/video/showvideo/' +
      this.route.snapshot.paramMap.get('vid');
    console.log(this.videoPath);
  }
  ngOnInit(): void {}
  stopVideo(): void {
    this.http
      .post(
        'http://' +
          this.configService.getNodeAddress() +
          ':' +
          this.configService.getNodePort() +
          '/rest/video/stop',
        {},
      )
      .subscribe(res => {});
  }
}
export { LocalStreamPage };
