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

    constructor(private router: Router, private loadingService: LoadingService) {
        this.loading$ = this.loadingService.loading$;
    }

    ngOnInit(): void {
        window.onpopstate = (event) => {
            this.router.navigate(['/support-technician']);
        }

        if(localStorage.getItem('userRole') !== 'SupportTechnician') {
            this.router.navigate(['/login']);
        }
    }
}
