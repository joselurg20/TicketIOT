import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';


export interface PeriodicElement {
  id: number;
  title: string;
  name: string;
  email: string;
  priority: string;
  state: string;
  timestamp: string;
  userID: number;
  status: boolean;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: 1, title: 'Ticket 1', name: 'User 1', email: 'Email 1', priority: 'Alta', state: 'Abierto', timestamp: '2/2/2022', userID: 1, status: true },
  { id: 2, title: 'Ticket 2', name: 'User 2', email: 'Email 2', priority: 'Alta', state: 'Abierto', timestamp: '2/2/2022', userID: 1, status: true },
  { id: 3, title: 'Ticket 3', name: 'User 3', email: 'Email 3', priority: 'Alta', state: 'Abierto', timestamp: '2/2/2022', userID: 1, status: true },
  { id: 4, title: 'Ticket 4', name: 'User 4', email: 'Email 4', priority: 'Alta', state: 'Abierto', timestamp: '2/2/2022', userID: 1, status: true },
  { id: 5, title: 'Ticket 5', name: 'User 5', email: 'Email 5', priority: 'Alta', state: 'Abierto', timestamp: '2/2/2022', userID: 1, status: true },
  { id: 6, title: 'Ticket 6', name: 'User 6', email: 'Email 6', priority: 'Alta', state: 'Abierto', timestamp: '2/2/2022', userID: 1, status: true },
  { id: 7, title: 'Ticket 7', name: 'User 7', email: 'Email 7', priority: 'Alta', state: 'Abierto', timestamp: '2/2/2022', userID: 1, status: true },
  { id: 8, title: 'Ticket 8', name: 'User 8', email: 'Email 8', priority: 'Alta', state: 'Abierto', timestamp: '2/2/2022', userID: 1, status: true },
  { id: 9, title: 'Ticket 9', name: 'User 9', email: 'Email 9', priority: 'Alta', state: 'Abierto', timestamp: '2/2/2022', userID: 1, status: true },
  /*
  {id: 10, title: 'Ticket 10', name: 'User 10', email: 'Email 10', priority: 'Alta', state: 'Abierto', timestamp: '2/2/2022', userID: 1, status: true},
  {id: 11, title: 'Ticket 11', name: 'User 11', email: 'Email 11', priority: 'Alta', state: 'Abierto', timestamp: '2/2/2022', userID: 1, status: true},
  {id: 12, title: 'Ticket 12', name: 'User 12', email: 'Email 12', priority: 'Alta', state: 'Abierto', timestamp: '2/2/2022', userID: 1, status: true},
  {id: 13, title: 'Ticket 13', name: 'User 13', email: 'Email 13', priority: 'Alta', state: 'Abierto', timestamp: '2/2/2022', userID: 1, status: true},
  {id: 14, title: 'Ticket 14', name: 'User 14', email: 'Email 14', priority: 'Alta', state: 'Abierto', timestamp: '2/2/2022', userID: 1, status: true},
  {id: 15, title: 'Ticket 15', name: 'User 15', email: 'Email 15', priority: 'Alta', state: 'Abierto', timestamp: '2/2/2022', userID: 1, status: true},
  */
];


@Component({
  selector: 'app-incidence-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './incidence-table.component.html',
  styleUrls: ['./incidence-table.component.scss']
})
export class IncidenceTableComponent implements AfterViewInit, OnInit {


  displayedColumns: string[] = ['id', 'title', 'name', 'email', 'priority', 'state', 'timestamp', 'userID'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(private _liveAnnouncer: LiveAnnouncer) { }

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  announceSortChange(sortState: Sort) {

    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  selectedRow: any;
  unhighlightRow($event: MouseEvent) {
    throw new Error('Method not implemented.');
  }
  onRowClicked(_t114: any) {
    throw new Error('Method not implemented.');
  }
  highlightRow($event: MouseEvent) {
    throw new Error('Method not implemented.');
  }
  /*
  dataSource: CdkTableDataSourceInput<any> | undefined;
  displayedColumns: any;

  announceSortChange($event: Sort) {
  throw new Error('Method not implemented.');
  }*/
  tickets() {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  /*
  ngAfterViewInit(): void {
  throw new Error('Method not implemented.');
  }

  */

}
