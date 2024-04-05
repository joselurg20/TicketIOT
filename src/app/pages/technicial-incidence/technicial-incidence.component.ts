import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenceDataComponent } from "../../components/incidences/incidence-data/incidence-data.component";
import { ComunicationComponent } from "../../components/messages/comunication/comunication.component";
import { TechnicialComponent } from "../../components/data/technicial/technicial.component";
import { ButtonComponent } from "../../components/button/button.component";
import { Router } from '@angular/router';

@Component({
    selector: 'app-technicial-incidence',
    standalone: true,
    templateUrl: './technicial-incidence.component.html',
    styleUrls: ['./technicial-incidence.component.scss'],
    imports: [CommonModule, IncidenceDataComponent, ComunicationComponent, TechnicialComponent, ButtonComponent]
})
export class TechnicialIncidenceComponent implements OnInit {

    constructor(private router: Router) {}

    ngOnInit(): void {
        window.onpopstate = (event) => {
            this.router.navigate(['/support-technician']);
        }
    }
}
