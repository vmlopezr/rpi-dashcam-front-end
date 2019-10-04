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

@Component({
  selector: 'app-input-row',
  templateUrl: './input-row.component.html',
  styleUrls: ['./input-row.component.scss'],
})
export class InputRowComponent implements OnInit {
  @Input() data: string;
  thumbnail: string;
  titleDisplayed: string;
  Months = {
    Jan: ' January',
    Feb: 'February',
    Mar: 'March',
    Apr: 'April',
    May: 'May',
    Jun: 'June',
    Jul: 'July',
    Aug: 'August',
    Sep: 'September',
    Oct: 'October',
    Nov: 'November',
    Dec: 'December',
  };
  videoPath: string;

  constructor() {}

  ngOnInit(): void {
    this.thumbnail =
      'http://localhost:8000/rest/info/thumbnail/' +
      this.data.substr(0, this.data.lastIndexOf('.')) +
      '.jpg';
    this.processImageTitle();
    this.videoPath = '/local-stream/' + this.data;
  }

  processImageTitle(): void {
    const timestamp = this.data
      .substr(0, this.data.lastIndexOf('.'))
      .replace(/\_|-/g, '');
    const seconds = timestamp.slice(-2);

    const minutes = timestamp.substring(
      timestamp.length - 4,
      timestamp.length - 2,
    );
    const hours = parseInt(
      timestamp.substring(timestamp.length - 6, timestamp.length - 4),
    );
    const year = parseInt(
      timestamp.substring(timestamp.length - 10, timestamp.length - 6),
    );
    const day = parseInt(
      timestamp.substring(timestamp.length - 12, timestamp.length - 10),
    );
    const month = timestamp.substring(0, timestamp.length - 12);
    const suffix = hours >= 12 ? ' PM' : ' AM';
    const newTime =
      ((hours + 11) % 12) + 1 + ':' + minutes + ':' + seconds + suffix;

    this.titleDisplayed =
      this.Months[month] + ' ' + day + ', ' + year + ' at ' + newTime;
  }
}

export class InputRow {}
