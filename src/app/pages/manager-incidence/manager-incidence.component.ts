import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { LoadingService } from 'src/app/services/loading.service';
import { ButtonComponent } from "../../components/button/button.component";
import { ManagerComponent } from "../../components/data/manager/manager.component";
import { IncidenceDataComponent } from "../../components/incidences/incidence-data/incidence-data.component";
import { ComunicationComponent } from "../../components/messages/comunication/comunication.component";
import { LoadingComponent } from "../../components/shared/loading.component";

@Component({
    selector: 'app-support-incidence',
    standalone: true,
    templateUrl: './manager-incidence.component.html',
    styleUrls: ['./manager-incidence.component.scss'],
    imports: [CommonModule, IncidenceDataComponent, ManagerComponent,
        ComunicationComponent, ButtonComponent, SidebarComponent, MatProgressSpinnerModule, LoadingComponent]
})
export class ManagerIncidenceComponent implements OnInit {

    loading$: Observable<boolean>;

    constructor(private router: Router, private loadingService: LoadingService) {
        this.loading$ = this.loadingService.loading$;
    }

    ngOnInit(): void {
        window.onpopstate = (event) => {
            this.router.navigate(['/support-manager']);
        }

        if (localStorage.getItem('userRole') !== 'SupportManager') {
            this.router.navigate(['/login']);
        };
    }
}
