import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { Routes } from 'src/app/utilities/routes';
import { Observable } from 'rxjs';
import { ChartBarComponent } from 'src/app/components/grafics/chart-bar/chart-bar.component';
import { iTicketTable } from 'src/app/models/tickets/iTicketTable';
import { iUserTable } from 'src/app/models/users/iUserTable';
import { LoadingService } from 'src/app/services/loading.service';
import { TicketDataService } from 'src/app/services/tickets/ticketData.service';
import { LoginService } from 'src/app/services/users/login.service';
import { UsersService } from 'src/app/services/users/users.service';
import { Roles } from 'src/app/utilities/literals';
import { ChartDoughnutComponent } from "../../components/grafics/chart-doughnut/chart-doughnut.component";
import { ChartPieComponent } from "../../components/grafics/chart-pie/chart-pie.component";
import { IncidenceIndexComponent } from "../../components/incidences/incidence-index/incidence-index.component";
import { IncidenceTableComponent } from "../../components/incidences/incidence-table/incidence-table.component";
import { MessageComponent } from "../../components/messages/menssage/message.component";
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

    tickets: iTicketTable[] = [];
    users: iUserTable[] = [];
    isLoading: boolean = true;
    loading$: Observable<boolean>;

    constructor(private loginService: LoginService, private router: Router, private routes: Routes, private ticketsService: TicketDataService,
                private loadingService: LoadingService, private usersService: UsersService) {
        this.loading$ = this.loadingService.loading$;
    }

    ngOnInit(): void {
        window.onpopstate = (event) => {
            this.loadingService.showLoading();
            this.loginService.logout();            
            this.router.navigate([Routes.login]);
        }
        if (this.usersService.currentUser?.role !== Roles.managerRole) {
            this.loadingService.showLoading();
            this.router.navigate([Routes.login]);
        }
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
