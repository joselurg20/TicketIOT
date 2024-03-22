import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenceTableComponent } from "../../components/incidences/incidence-table/incidence-table.component";
import { TechnicalTableComponent } from "../../components/technical-table/technical-table.component";
import { ChartPieComponent } from "../../components/grafics/chart-pie/chart-pie.component";
import { ChartDoughnutComponent } from "../../components/grafics/chart-doughnut/chart-doughnut.component";
import { MatGridListModule } from '@angular/material/grid-list';
import { ChartBarComponent } from 'src/app/components/grafics/chart-bar/chart-bar.component';
import { MessageComponent } from "../../components/messages/menssage/message.component";

interface Tile {
    cols: number;
    rows: number;
    component: any;
}

@Component({
    selector: 'app-support-manager',
    standalone: true,
    templateUrl: './support-manager.component.html',
    styleUrls: ['./support-manager.component.scss'],
    imports: [CommonModule, IncidenceTableComponent, TechnicalTableComponent, ChartPieComponent, ChartDoughnutComponent, MatGridListModule, ChartBarComponent, MessageComponent]
})
export class SupportManagerComponent {
logout() {
throw new Error('Method not implemented.');
}

tiles: Tile[] = [
    {component: IncidenceTableComponent, cols: 4, rows: 4},
    {component: ChartPieComponent, cols: 2, rows: 1.5},
    {component: ChartDoughnutComponent, cols: 2, rows: 1.5},
    {component: ChartBarComponent, cols: 4, rows: 2 },
  ];

}
