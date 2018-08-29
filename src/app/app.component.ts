import { HourRow } from './table-cell/hour-row'
import { Component } from '@angular/core';
import * as moment from 'moment';
import 'moment-timezone';

// Source: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/moment-timezone/index.d.ts
declare module "moment" {
  interface Moment {
    tz(): string | undefined;
    tz(timezone: string, keepLocalTime?: boolean): Moment;
    zoneAbbr(): string;
    zoneName(): string;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  range: Array<HourRow>;

  constructor() {
    // Fri Aug 31 2018 12:00:00 GMT-0700 (Pacific Daylight Time)
    // const startTime = new Date(Date.UTC(2018, 8 - 1, 31, 19, 0, 0));

    // Mon Sep 24 2018 11:35:00 GMT-0700 (Pacific Daylight Time)
    // const endTime = new Date(Date.UTC(2018, 9 - 1, 24, 18, 35, 0));

    // By default, moment parses and displays in local time.
    // If you want to parse or display a moment in UTC, you can use `moment.utc()`.
    const startTime = moment.utc('2018-08-31T19:00:00Z');
    const endTime = moment.utc('2018-09-24T18:35:00Z');

    const myLocation = [
      {
        start: moment.utc('2018-08-31T19:00:00Z'),
        seattle: true,
        china: true,
      },
      {
        start: moment.utc('2018-09-01T15:00:00+08:00'),
        china: true,
      }
    ];
    console.log(myLocation[1].start.clone().tz('Asia/Shanghai').toString());

    const momentRange: Array<moment.Moment> = this.createMomentRange(startTime, endTime);
    this.createRange(momentRange);

    console.log(this.range.length);
  }

  private createMomentRange(startTime: moment.Moment, endTime: moment.Moment): Array<moment.Moment> {
    const range: Array<moment.Moment> = [];
    const currentTime = startTime.clone();

    // Make sure the last hour is fully covered by the range by adding one hour.
    const finalTime = endTime.clone().add(1, 'h');

    while (currentTime < finalTime) {
      range.push(currentTime.clone());
      currentTime.add(1, 'h');
    }

    return range;
  }

  private createRange(momentRange: Array<moment.Moment>) {
    this.range = [];

    for (const currentTime of momentRange) {
      // List of time zones: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
      const local = currentTime.clone().tz('America/Mexico_City'); // TODO: Revert to currentTime.local()
      const seattle = currentTime.clone().tz('America/Los_Angeles');
      const china = currentTime.clone().tz('Asia/Shanghai');
      const korea = currentTime.clone().tz('Asia/Seoul');
      const japan = currentTime.clone().tz('Asia/Tokyo');

      const min = moment.min(local, seattle, china, korea, japan);

      this.range.push({
        date : {
          content: min.format('ddd, MMM D, YYYY'),
          className: min.dayOfYear() % 2 ? 'style1' : 'style2',
        },
        local: {
          content: local.format('LTS'),
          className: local.dayOfYear() % 2 ? 'style1' : 'style2',
        },
        seattle: {
          content: seattle.format('LTS'),
          className: seattle.dayOfYear() % 2 ? 'style1' : 'style2',
        },
        china: {
          content: china.format('LTS'),
          className: china.dayOfYear() % 2 ? 'style1' : 'style2',
        },
        korea: {
          content: korea.format('LTS'),
          className: korea.dayOfYear() % 2 ? 'style1' : 'style2',
        },
        japan: {
          content: japan.format('LTS'),
          className: japan.dayOfYear() % 2 ? 'style1' : 'style2',
        },
      });
      currentTime.add(1, 'h');
    }
  }
}
