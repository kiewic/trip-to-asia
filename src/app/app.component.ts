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

interface HourRow {
  local: string;
  seattle: string;
  china?: string;
  korea?: string;
  japan?: string;
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
    const startTime = moment.utc("2018-08-31T19:00:00Z")
    const endTime = moment.utc("2018-09-24T18:35:00Z");

    this.createRange(startTime, endTime);

    console.log(this.range.length);
  }

  private createRange(startTime: moment.Moment, endTime: moment.Moment) {
    this.range = [];
    const currentTime = startTime.clone();

    // Make sure the last hour is fully covered by the range by adding one hour.
    const finalTime = endTime.clone().add(1, 'h');

    while (currentTime < finalTime) {
      console.log(currentTime, 'vs', finalTime);

      // List of time zones: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
      this.range.push({
        local: currentTime.local().format('llll'),
        seattle: currentTime.clone().tz("America/Los_Angeles").format('llll'),
        china: currentTime.clone().tz("Asia/Shanghai").format('llll'),
        korea: currentTime.clone().tz("Asia/Seoul").format('llll'),
        japan: currentTime.clone().tz("Asia/Tokyo").format('llll'),
      });
      currentTime.add(1, 'h');
    }
  }
}
