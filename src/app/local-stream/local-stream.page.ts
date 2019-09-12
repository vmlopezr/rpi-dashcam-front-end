import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-local-stream',
	templateUrl: './local-stream.page.html',
	styleUrls: [
		'./local-stream.page.scss',
	],
})
class LocalStreamPage implements OnInit {
	video_path: string = '';
	constructor (private http: HttpClient, private route: ActivatedRoute) {
		this.video_path =
			'http://localhost:50000/rest/video/showvideo/' +
			this.route.snapshot.paramMap.get('vid');
	}
	stopVideo () {
		this.http.post('http://localhost:50000/rest/video/stop', {}).subscribe((res) => {});
	}
	ngOnInit () {}
}
export { LocalStreamPage };
