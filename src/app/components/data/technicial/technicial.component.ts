import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketUpdateService } from 'src/app/services/tickets/ticketUpdate.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'src/app/services/loading.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { LocalStorageKeys } from 'src/app/utilities/literals';
import { Status } from 'src/app/utilities/enum';

@Component({
  selector: 'app-technicial',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './technicial.component.html',
  styleUrls: ['./technicial.component.scss']
})
export class TechnicialComponent {

  selectedStatusValue: number = -1;
  status: Status[] = Object.values(Status).filter(value => typeof value === 'number') as Status[];

  constructor(private ticketsService: TicketsService, private ticketUpdateService: TicketUpdateService,
              private loadingService: LoadingService, private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use('es');

    }
  }

  /**
   * Actualiza el estado de una incidencia.
   */
  updateTicket() {
    if (this.selectedStatusValue != -1) {
      this.loadingService.showLoading();
      this.ticketsService.changeTicketStatus(parseInt(localStorage.getItem(LocalStorageKeys.selectedTicket)!), this.selectedStatusValue).subscribe({
        next: () => {
          this.ticketUpdateService.triggerTicketUpdate();
          this.loadingService.hideLoading();
        },
        error: (error: any) => {
          console.error('Error al cambiar el estado', error);
        }
      })
    }
  }

  /**
   * Obtiene el texto a representar en función de la prioridad y el idioma.
   * @param priority la prioridad.
   * @returns la cadena de texto a representar.
   */
  getPriorityString(priority: number): string {
    if(localStorage.getItem(LocalStorageKeys.selectedLanguage) == 'en') {
      switch (priority) {
        case 1:
          return 'LOWEST';
        case 2:
          return 'LOW';
        case 3:
          return 'MEDIUM';
        case 4:
          return 'HIGH';
        case 5:
          return 'HIGHEST';
        default:
          return 'NOT SURE';
      }
    } else if (localStorage.getItem(LocalStorageKeys.selectedLanguage) == 'es') {
      switch (priority) {
        case 1:
          return 'MUY BAJA';
        case 2:
          return 'BAJA';
        case 3:
          return 'MEDIA';
        case 4:
          return 'ALTA';
        case 5:
          return 'MUY ALTA';
        default:
          return 'INDEFINIDA';
      }
    }
    return '';
  }

  /**
   * Obtiene el texto a representar en función del estado y el idioma.
   * @param status el estado.
   * @returns la cadena de texto a representar.
   */
  getStatusString(status: number): string {
    if(localStorage.getItem(LocalStorageKeys.selectedLanguage) == 'en') {
      switch (status) {
        case 1:
          return 'OPENED';
        case 2:
          return 'PAUSED';
        case 3:
          return 'FINISHED';
        default:
          return 'PENDING';
      }
    } else if (localStorage.getItem(LocalStorageKeys.selectedLanguage) == 'es') {
      switch (status) {
        case 1:
          return 'ABIERTA';
        case 2:
          return 'PAUSADA';
        case 3:
          return 'TERMINADA';
        default:
          return 'PENDIENTE';
      }
    }
    return '';
  }

}
