import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartBarComponent } from 'src/app/components/grafics/chart-bar/chart-bar.component';
import { ChartDoughnutComponent } from 'src/app/components/grafics/chart-doughnut/chart-doughnut.component';
import { ChartPieComponent } from 'src/app/components/grafics/chart-pie/chart-pie.component';
import { TechnicalTableComponent } from 'src/app/components/technical-table/technical-table.component';
import { IncidenceIndexComponent } from 'src/app/components/incidences/incidence-index/incidence-index.component';
import { IncidenceTableComponent } from 'src/app/components/incidences/incidence-table/incidence-table.component';
import { IncidenceDataComponent } from "../../components/incidences/incidence-data/incidence-data.component";
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-support-technical',
    standalone: true,
    templateUrl: './support-technical.component.html',
    styleUrls: ['./support-technical.component.scss'],
    imports: [CommonModule, IncidenceTableComponent, TechnicalTableComponent, ChartPieComponent,
        ChartDoughnutComponent, ChartBarComponent, IncidenceDataComponent, IncidenceIndexComponent,
        SidebarComponent, MatProgressSpinnerModule]
})
export class SupportTechnicalComponent implements OnInit {

    isLoading: boolean = true;

constructor(private loginService: LoginService, private router: Router) {}

    ngOnInit(): void {
        window.onpopstate = (event) => {
            this.loginService.logout();
            this.router.navigate(['/login']);
        }
        
        setTimeout(() => {
            this.isLoading = false;
        }, 1000);
    }
}
