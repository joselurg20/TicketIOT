import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketUpdateService } from 'src/app/services/ticketUpdate.service';
import { ApiService } from 'src/app/services/api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-technicial',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './technicial.component.html',
  styleUrls: ['./technicial.component.scss']
})
export class TechnicialComponent {

  public states: string[] = ['OPENED', 'PAUSED', 'FINISHED'];
  selectedState: string = '';
  selectedStateValue: number = -1;

  constructor(private apiService: ApiService, private ticketUpdateService: TicketUpdateService, private translate: TranslateService) {
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
    if (this.selectedStateValue != -1) {
      this.apiService.changeTicketState(parseInt(localStorage.getItem('selectedTicket')!), this.selectedStateValue).subscribe({
        next: () => {
          console.log('Estado cambiado correctamente');
          setTimeout(() => {
            this.ticketUpdateService.triggerTicketUpdate();
          }, 1000);
        },
        error: (error: any) => {
          console.error('Error al cambiar el estado', error);
        }
      })
    }
    this.ticketUpdateService.triggerTicketUpdate();
  }

}
