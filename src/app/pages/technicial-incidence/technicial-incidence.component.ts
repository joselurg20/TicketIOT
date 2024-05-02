import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenceDataComponent } from "../../components/incidences/incidence-data/incidence-data.component";
import { ComunicationComponent } from "../../components/messages/comunication/comunication.component";
import { TechnicialComponent } from "../../components/data/technicial/technicial.component";
import { ButtonComponent } from "../../components/button/button.component";
import { Router } from '@angular/router';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { LoadingComponent } from "../../components/shared/loading.component";
import { LoadingService } from 'src/app/services/loading.service';
import { Observable } from 'rxjs';
import { LocalStorageKeys, Roles } from 'src/app/utilities/literals';
import { iUser } from 'src/app/models/users/iUser';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
    selector: 'app-technicial-incidence',
    standalone: true,
    templateUrl: './technicial-incidence.component.html',
    styleUrls: ['./technicial-incidence.component.scss'],
    imports: [CommonModule, IncidenceDataComponent, ComunicationComponent,
        TechnicialComponent, ButtonComponent, SidebarComponent, MatProgressSpinnerModule, LoadingComponent]
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
            this.router.navigate(['/support-technician']);
        }

        if(this.usersService.currentUser?.role !== Roles.technicianRole) {
            this.router.navigate(['/login']);
        }
        this.loadingService.hideLoading();
    }
}
