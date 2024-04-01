import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenceDataComponent } from "../../components/incidences/incidence-data/incidence-data.component";
import { ManagerComponent } from "../../components/data/manager/manager.component";
import { ComunicationComponent } from "../../components/messages/comunication/comunication.component";

@Component({
    selector: 'app-support-incidence',
    standalone: true,
    templateUrl: './manager-incidence.component.html',
    styleUrls: ['./manager-incidence.component.scss'],
    imports: [CommonModule, IncidenceDataComponent, ManagerComponent, ComunicationComponent]
})
export class ManagerIncidenceComponent {

}
