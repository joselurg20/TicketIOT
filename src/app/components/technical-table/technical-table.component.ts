import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

export interface PeriodicElement {
  id: number;
  name: string;
  correo: string;
  numero: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: 1, name: 'tecnico1', correo: 'tecnico1@gmail.com', numero: '1' },
  { id: 2, name: 'tecnico2', correo: 'tecnico2@gmail.com', numero: '2' },
  { id: 3, name: 'tecnico3', correo: 'tecnico3@gmail.com', numero: '3' },
  { id: 4, name: 'tecnico4', correo: 'tecnico4@gmail.com', numero: '4' },
  { id: 5, name: 'tecnico5', correo: 'tecnico5@gmail.com', numero: '5' },
];

@Component({
  selector: 'app-technical-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './technical-table.component.html',
  styleUrls: ['./technical-table.component.scss']
})
export class TechnicalTableComponent {
  displayedColumns: string[] = ['id', 'name', 'correo', 'numero'];
  dataSource = ELEMENT_DATA;
}
