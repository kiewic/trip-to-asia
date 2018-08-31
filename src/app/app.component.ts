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

interface LocationItem {
  start: moment.Moment,
  seattle?: boolean,
  china?: boolean,
  korea?: boolean,
  japan?: boolean,
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

    const myLocations: LocationItem[] = [
      {
        start: moment.utc('2018-08-31T12:00:00-07:00'),
        seattle: true,
        china: true,
      }, {
        start: moment.utc('2018-09-01T15:00:00+08:00'),
        china: true,
      }, {
        start: moment.utc('2018-09-07T13:35:00+08:00'),
        china: true,
        korea: true,
      }, {
        start: moment.utc('2018-09-07T16:45:00+09:00'),
        korea: true,
      }, {
        start: moment.utc('2018-09-10T16:50:00+09:00'),
        korea: true,
        japan: true,
      }, {
        start: moment.utc('2018-09-10T18:35:00+09:00'),
        japan: true,
      }, {
        start: moment.utc('2018-09-18T16:55:00+08:00'),
        japan: true,
        china: true,
      }, {
        start: moment.utc('2018-09-18T21:15:00+08:00'),
        china: true,
      }, {
        start: moment.utc('2018-09-24T15:50:00+08:00'),
        china: true,
        seattle: true,
      }, {
        start: moment.utc('2018-09-24T11:35:00-07:00'),
        seattle: true,
      }, {
        start: moment.utc('2018-09-24T13:00:00-07:00'),
      },
    ];
    // console.log(myLocations[9].start.clone().tz('America/Los_Angeles').toString());

    const momentRange: Array<moment.Moment> = this.createMomentRange(startTime, endTime);
    this.createRange(momentRange, myLocations);

    // console.log(this.range.length);
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

  private createRange(momentRange: Array<moment.Moment>, locations: LocationItem[]) {
    this.range = [];

    for (const currentTime of momentRange) {
      // List of time zones: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
      // const local = currentTime.clone().tz('America/Mexico_City');
      const local = currentTime.clone().local();
      const seattle = currentTime.clone().tz('America/Los_Angeles');
      const china = currentTime.clone().tz('Asia/Shanghai');
      const korea = currentTime.clone().tz('Asia/Seoul');
      const japan = currentTime.clone().tz('Asia/Tokyo');

      const min = moment.min(local, seattle, china, korea, japan);

      const rangeItem: HourRow = {
        date : {
          content: min.format('ddd, MMM D, YYYY'),
          classNames: [min.dayOfYear() % 2 ? 'style1' : 'style2', 'opaque'],
        },
        local: {
          content: local.format('LTS'),
          classNames: [local.dayOfYear() % 2 ? 'style1' : 'style2', 'opaque'],
        },
        seattle: {
          content: seattle.format('LTS'),
          classNames: [seattle.dayOfYear() % 2 ? 'style1' : 'style2'],
        },
        china: {
          content: china.format('LTS'),
          classNames: [china.dayOfYear() % 2 ? 'style1' : 'style2'],
        },
        korea: {
          content: korea.format('LTS'),
          classNames: [korea.dayOfYear() % 2 ? 'style1' : 'style2'],
        },
        japan: {
          content: japan.format('LTS'),
          classNames: [japan.dayOfYear() % 2 ? 'style1' : 'style2'],
        },
      };

      for (let i = 0, len = locations.length; i + 1 < len; i++) {
        const minPlusOne = min.clone().add(1, 'h');
        const start = locations[i].start;
        const end = locations[i + 1].start;

        if (this.match(min, minPlusOne, start, end)) {
          const location = locations[i];
          if (location.seattle) {
            rangeItem.seattle.classNames.push('highlight', 'opaque');
          }
          if (location.china) {
            rangeItem.china.classNames.push('highlight', 'opaque');
          }
          if (location.korea) {
            rangeItem.korea.classNames.push('highlight', 'opaque');
          }
          if (location.japan) {
            rangeItem.japan.classNames.push('highlight', 'opaque');
          }
          //console.log(rangeItem.seattle.highlight, rangeItem.china.highlight, rangeItem.korea.highlight, rangeItem.japan.highlight);
        }
      }

      this.range.push(rangeItem);
      currentTime.add(1, 'h');
    }
  }

  /**
   * We have three options to match:
   *
   * 1. start <= min < min+1h <= end
   * 2. min < start < min+1h < end
   * 3. start < min < end < min+1h
   */
  private match(
    min: moment.Moment,
    minPlusOne: moment.Moment,
    start: moment.Moment,
    end: moment.Moment): boolean {
    if (!(min < minPlusOne)) {
      throw new Error('min must be smaller than minPlusOne');
    }
    if (!(start < end)) {
      throw new Error('start must be smaller than end');
    }
    if (start <= min && minPlusOne <= end) {
      return true;
    }
    if (min < start && start < minPlusOne) {
      return true;
    }
    if (min < end && end < minPlusOne) {
      return true;
    }
    return false;
  }
}
