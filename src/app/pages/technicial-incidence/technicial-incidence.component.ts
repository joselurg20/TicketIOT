import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { LoadingService } from 'src/app/services/loading.service';
import { UsersService } from 'src/app/services/users/users.service';
import { Roles } from 'src/app/utilities/literals';
import { Routes } from 'src/app/utilities/routes';
import { ButtonComponent } from "../../components/button/button.component";
import { TechnicialComponent } from "../../components/data/technicial/technicial.component";
import { IncidenceDataComponent } from "../../components/incidences/incidence-data/incidence-data.component";
import { ComunicationComponent } from "../../components/messages/comunication/comunication.component";
import { LoadingComponent } from "../../components/shared/loading.component";

@Component({
    selector: 'app-technicial-incidence',
    standalone: true,
    imports: [CommonModule, IncidenceDataComponent, ComunicationComponent,
        TechnicialComponent, ButtonComponent, SidebarComponent, MatProgressSpinnerModule, LoadingComponent],
    templateUrl: './technicial-incidence.component.html',
    styleUrls: ['./technicial-incidence.component.scss']
    
})
export class TechnicialIncidenceComponent implements OnInit {

    loading$: Observable<boolean>;

    constructor(private router: Router, private loadingService: LoadingService,
                private usersService: UsersService) {
        this.loading$ = this.loadingService.loading$;
    }

    ngOnInit(): void {
        this.loadingService.showLoading();
        window.onpopstate = (event) => {
            this.router.navigate([Routes.supportTechnician]);
        }

        if(this.usersService.currentUser?.role !== Roles.technicianRole) {
            this.router.navigate([Routes.login]);
        }
        this.loadingService.hideLoading();
    }
}
