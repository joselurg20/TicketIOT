import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenceTableComponent } from "../../components/incidences/incidence-table/incidence-table.component";
import { TechnicalTableComponent } from "../../components/technical-table/technical-table.component";

@Component({
    selector: 'app-support-manager',
    standalone: true,
    templateUrl: './support-manager.component.html',
    styleUrls: ['./support-manager.component.scss'],
    imports: [CommonModule, IncidenceTableComponent, TechnicalTableComponent]
})
export class SupportManagerComponent {
logout() {
throw new Error('Method not implemented.');
}

}
