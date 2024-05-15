import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataComponent } from 'src/app/components/data/data.component';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { LoadingService } from 'src/app/services/loading.service';
import { UsersService } from 'src/app/services/users/users.service';
import { ButtonComponent } from "../../components/button/button.component";
import { IncidenceDataComponent } from "../../components/incidences/incidence-data/incidence-data.component";
import { ComunicationComponent } from "../../components/messages/comunication/comunication.component";
import { LoadingComponent } from "../../components/shared/loading.component";

@Component({
    selector: 'app-technicial-incidence',
    standalone: true,
    imports: [CommonModule, IncidenceDataComponent, ComunicationComponent, ButtonComponent, SidebarComponent, MatProgressSpinnerModule, LoadingComponent, DataComponent],
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
    }
}
