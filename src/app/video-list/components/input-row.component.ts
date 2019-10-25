import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-input-row',
  templateUrl: './input-row.component.html',
  styleUrls: ['./input-row.component.scss'],
})
export class InputRowComponent implements OnInit {
  @Input() data: string;
  thumbnail: string;
  titleDisplayed: string;
  videoPath: string;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.thumbnail =
      'http://' +
      this.configService.getNodeAddress() +
      ':' +
      this.configService.getNodePort() +
      '/rest/info/thumbnail/' +
      this.data.substr(0, this.data.lastIndexOf('.')) +
      '.jpg';
    this.processImageTitle();
    this.videoPath = '/local-stream/' + this.data;
  }

  processImageTitle(): void {
    this.titleDisplayed = this.data
      .substr(0, this.data.lastIndexOf('.'))
      .replace(/_/g, ' ');
    this.titleDisplayed = this.titleDisplayed.replace(/\./g, ':');
  }
}

export class InputRow {}
