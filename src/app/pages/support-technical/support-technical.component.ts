import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChartBarComponent } from 'src/app/components/graphics/chart-bar/chart-bar.component';
import { ChartDoughnutComponent } from 'src/app/components/graphics/chart-doughnut/chart-doughnut.component';
import { ChartPieComponent } from 'src/app/components/graphics/chart-pie/chart-pie.component';
import { IncidenceIndexComponent } from 'src/app/components/incidences/incidence-index/incidence-index.component';
import { IncidenceTableComponent } from 'src/app/components/incidences/incidence-table/incidence-table.component';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { TechnicalTableComponent } from 'src/app/components/technical-table/technical-table.component';
import { iTicketTable } from 'src/app/models/tickets/iTicketTable';
import { LoadingService } from 'src/app/services/loading.service';
import { TicketDataService } from 'src/app/services/tickets/ticketData.service';
import { LoginService } from 'src/app/services/users/login.service';
import { UsersService } from 'src/app/services/users/users.service';
import { IncidenceDataComponent } from "../../components/incidences/incidence-data/incidence-data.component";
import { LoadingComponent } from "../../components/shared/loading/loading.component";

@Component({
    selector: 'app-support-technical',
    standalone: true,
    imports: [CommonModule, IncidenceTableComponent, TechnicalTableComponent, ChartPieComponent,
        ChartDoughnutComponent, ChartBarComponent, IncidenceDataComponent, IncidenceIndexComponent,
        SidebarComponent, MatProgressSpinnerModule, LoadingComponent],
    templateUrl: './support-technical.component.html',
    styleUrls: ['./support-technical.component.scss']

})
export class SupportTechnicalComponent implements OnInit {

    tickets: iTicketTable[] = [];
    loading$: Observable<boolean>;

    constructor(private loginService: LoginService, private router: Router, private ticketsService: TicketDataService,
                private loadingService: LoadingService, private usersService: UsersService) {
        this.loading$ = this.loadingService.loading$;
    }

    ngOnInit(): void {

        this.ticketsService.getTickets(false);
        this.ticketsService.tickets$.subscribe(tickets => {
            this.loadingService.showLoading();
            this.tickets = tickets;
            this.loadingService.hideLoading();
        });
    }
}
