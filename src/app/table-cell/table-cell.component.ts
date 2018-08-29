import { Component, Input, OnInit } from '@angular/core';
import { DateCell } from './date-cell'

@Component({
  selector: '[my-td]',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.css']
})
export class TableCellComponent implements OnInit {
  @Input() dateCell: DateCell;

  constructor() { }

  ngOnInit() {
  }
}
