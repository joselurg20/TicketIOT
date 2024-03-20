import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenceTableComponent } from "../../components/incidences/incidence-table/incidence-table.component";

@Component({
    selector: 'app-support-manager',
    standalone: true,
    templateUrl: './support-manager.component.html',
    styleUrls: ['./support-manager.component.scss'],
    imports: [CommonModule, IncidenceTableComponent]
})
export class SupportManagerComponent {

}
