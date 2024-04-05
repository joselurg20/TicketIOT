import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenceDataComponent } from "../../components/incidences/incidence-data/incidence-data.component";
import { ManagerComponent } from "../../components/data/manager/manager.component";
import { ComunicationComponent } from "../../components/messages/comunication/comunication.component";
import { ButtonComponent } from "../../components/button/button.component";
import { Router } from '@angular/router';

@Component({
    selector: 'app-support-incidence',
    standalone: true,
    templateUrl: './manager-incidence.component.html',
    styleUrls: ['./manager-incidence.component.scss'],
    imports: [CommonModule, IncidenceDataComponent, ManagerComponent, ComunicationComponent, ButtonComponent]
})
export class ManagerIncidenceComponent implements OnInit {

    constructor(private router: Router) {}

    ngOnInit(): void {
        window.onpopstate = (event) => {
            this.router.navigate(['/support-manager']);
        }
    }
}
