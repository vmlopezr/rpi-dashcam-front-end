import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.page.html',
  styleUrls: ['./video-list.page.scss'],
})
export class VideoListPage implements OnInit {
  dirData: string[];
  storageDirectory = '';

  constructor(private http: HttpClient) {
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
  getDirs(): void {
    this.http.get('http://localhost:8000/rest/info/dir').subscribe(res => {
      localStorage.setItem('dirData', JSON.stringify(res['data']));
      this.dirData = res['data'];
    });
  }
}
