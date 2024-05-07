import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { ChartBarComponent } from 'src/app/components/graphics/chart-bar/chart-bar.component';
import { LoadingService } from 'src/app/services/loading.service';
import { TicketDataService } from 'src/app/services/tickets/ticketData.service';
import { ChartDoughnutComponent } from "../../components/graphics/chart-doughnut/chart-doughnut.component";
import { ChartPieComponent } from "../../components/graphics/chart-pie/chart-pie.component";
import { IncidenceIndexComponent } from "../../components/incidences/incidence-index/incidence-index.component";
import { IncidenceTableComponent } from "../../components/incidences/incidence-table/incidence-table.component";
import { MessageComponent } from "../../components/messages/message/message.component";
import { LoadingComponent } from "../../components/shared/loading.component";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { TechnicalTableComponent } from "../../components/technical-table/technical-table.component";

interface Tile {
    cols: number;
    rows: number;
    component: any;
}

@Component({
    selector: 'app-support-manager',
    standalone: true,
    imports: [CommonModule, IncidenceTableComponent, TechnicalTableComponent, ChartPieComponent,
        ChartDoughnutComponent, MatGridListModule, ChartBarComponent, MessageComponent,
        SidebarComponent, IncidenceIndexComponent, MatProgressSpinnerModule, LoadingComponent],
    templateUrl: './support-manager.component.html',
    styleUrls: ['./support-manager.component.scss']
})
export class SupportManagerComponent implements OnInit {
    loading$: Observable<boolean>;

    constructor(private ticketsService: TicketDataService, private loadingService: LoadingService) {
        this.loading$ = this.loadingService.loading$;
    }

    ngOnInit(): void {
        this.ticketsService.getTickets(true);
        this.ticketsService.getTechnicians();
    }

    tiles: Tile[] = [
        { component: IncidenceTableComponent, cols: 4, rows: 4 },
        { component: ChartPieComponent, cols: 2, rows: 1.5 },
        { component: ChartDoughnutComponent, cols: 2, rows: 1.5 },
        { component: ChartBarComponent, cols: 4, rows: 2 },
    ];

}
