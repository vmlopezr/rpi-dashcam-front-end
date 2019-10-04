import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-local-stream',
  templateUrl: './local-stream.page.html',
  styleUrls: ['./local-stream.page.scss'],
})
class LocalStreamPage implements OnInit {
  videoPath = '';
  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.videoPath =
      'http://localhost:8000/rest/video/showvideo/' +
      this.route.snapshot.paramMap.get('vid');
  }
  stopVideo(): void {
    this.http
      .post('http://localhost:8000/rest/video/stop', {})
      .subscribe(res => {});
  }
  ngOnInit(): void {}
}
export { LocalStreamPage };
