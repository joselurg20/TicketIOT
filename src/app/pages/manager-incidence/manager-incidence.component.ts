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
import { LocalStorageKeys, Roles } from 'src/app/utilities/literals';
import { UsersService } from 'src/app/services/users/users.service';
import { iUser } from 'src/app/models/users/iUser';

@Component({
    selector: 'app-support-incidence',
    standalone: true,
    imports: [CommonModule, IncidenceDataComponent, ManagerComponent,
        ComunicationComponent, ButtonComponent, SidebarComponent, MatProgressSpinnerModule, LoadingComponent],
    templateUrl: './manager-incidence.component.html',
    styleUrls: ['./manager-incidence.component.scss']
    
})
export class ManagerIncidenceComponent implements OnInit {

    loading$: Observable<boolean>;

    constructor(private router: Router, private loadingService: LoadingService,
                private usersService: UsersService) {
        this.loading$ = this.loadingService.loading$;
    }

    ngOnInit(): void {
        this.loadingService.showLoading();
        window.onpopstate = (event) => {
            this.router.navigate(['/support-manager']);
        }

        if (this.usersService.currentUser?.role !== Roles.managerRole) {
            this.router.navigate(['/login']);
        };
        this.loadingService.hideLoading();
    }
}
