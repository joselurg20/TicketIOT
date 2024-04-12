import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenceTableComponent } from "../../components/incidences/incidence-table/incidence-table.component";
import { TechnicalTableComponent } from "../../components/technical-table/technical-table.component";
import { ChartPieComponent } from "../../components/grafics/chart-pie/chart-pie.component";
import { ChartDoughnutComponent } from "../../components/grafics/chart-doughnut/chart-doughnut.component";
import { MatGridListModule } from '@angular/material/grid-list';
import { ChartBarComponent } from 'src/app/components/grafics/chart-bar/chart-bar.component';
import { MessageComponent } from "../../components/messages/menssage/message.component";
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { iTicketTable } from 'src/app/models/tickets/iTicketTable';
import { iUserTable } from 'src/app/models/users/iUserTable';
import { ApiService } from 'src/app/services/api.service';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { IncidenceIndexComponent } from "../../components/incidences/incidence-index/incidence-index.component";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

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

loggedUsername: string = "";
tickets: iTicketTable[] = [];
users: iUserTable[] = [];
isShowingAll: boolean = false;
isLoading: boolean = true;

constructor(private loginService: LoginService, private router: Router) {
}

ngOnInit(): void {
    window.onpopstate = (event) => {
        this.loginService.logout();
        this.router.navigate(['/login']);
    }

    if(localStorage.getItem('userRole') !== 'SupportManager') {
        this.router.navigate(['/login']);
    }

    setTimeout(() => {
        this.isLoading = false;
      }, 1000);
}

/**
 * Cierra sesión.
 */
logout() {
    this.loginService.logout();
}

/**
 * Recibe datos del componente hijo.
 * @param data los datos del componente hijo.
 */
receiveDataFromChild(data: boolean) {
    this.isShowingAll = data;
    console.log('Datos recibidos en el padre:', this.isShowingAll);
  }



tiles: Tile[] = [
    {component: IncidenceTableComponent, cols: 4, rows: 4},
    {component: ChartPieComponent, cols: 2, rows: 1.5},
    {component: ChartDoughnutComponent, cols: 2, rows: 1.5},
    {component: ChartBarComponent, cols: 4, rows: 2 },
  ];

}
