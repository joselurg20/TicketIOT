import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { ChartBarComponent } from 'src/app/components/grafics/chart-bar/chart-bar.component';
import { iTicketTable } from 'src/app/models/tickets/iTicketTable';
import { iUserTable } from 'src/app/models/users/iUserTable';
import { LoginService } from 'src/app/services/login.service';
import { ChartDoughnutComponent } from "../../components/grafics/chart-doughnut/chart-doughnut.component";
import { ChartPieComponent } from "../../components/grafics/chart-pie/chart-pie.component";
import { IncidenceIndexComponent } from "../../components/incidences/incidence-index/incidence-index.component";
import { IncidenceTableComponent } from "../../components/incidences/incidence-table/incidence-table.component";
import { MessageComponent } from "../../components/messages/menssage/message.component";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { TechnicalTableComponent } from "../../components/technical-table/technical-table.component";
import { TicketsService } from 'src/app/services/tickets.service';
import { GraphUpdateService } from 'src/app/services/graphUpdateService';

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
    imports: [CommonModule, IncidenceTableComponent, TechnicalTableComponent, ChartPieComponent,
        ChartDoughnutComponent, MatGridListModule, ChartBarComponent, MessageComponent,
        SidebarComponent, IncidenceIndexComponent, MatProgressSpinnerModule]
})
export class SupportManagerComponent implements OnInit {

tickets: iTicketTable[] = [];
users: iUserTable[] = [];
isLoading: boolean = true;

constructor(private loginService: LoginService, private router: Router, private ticketsService: TicketsService) {
}

ngOnInit(): void {
    window.onpopstate = (event) => {
        this.loginService.logout();
        this.router.navigate(['/login']);
    }

    if(localStorage.getItem('userRole') !== 'SupportManager') {
        this.router.navigate(['/login']);
    }

    this.ticketsService.getTickets(true);
    this.ticketsService.tickets$.subscribe(tickets => {
      this.tickets = tickets;
      this.isLoading = false;
    });
}

tiles: Tile[] = [
    {component: IncidenceTableComponent, cols: 4, rows: 4},
    {component: ChartPieComponent, cols: 2, rows: 1.5},
    {component: ChartDoughnutComponent, cols: 2, rows: 1.5},
    {component: ChartBarComponent, cols: 4, rows: 2 },
  ];

}
