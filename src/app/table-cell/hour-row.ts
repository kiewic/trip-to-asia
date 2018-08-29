import { DateCell } from './date-cell'
import { TimeCell } from './time-cell'

export interface HourRow {
  date: DateCell;
  local: TimeCell;
  seattle: TimeCell;
  china: TimeCell;
  korea: TimeCell;
  japan: TimeCell;
}
