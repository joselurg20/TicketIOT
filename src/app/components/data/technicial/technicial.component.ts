import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketUpdateService } from 'src/app/services/ticketUpdate.service';
import { ApiService } from 'src/app/services/api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-technicial',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './technicial.component.html',
  styleUrls: ['./technicial.component.scss']
})
export class TechnicialComponent {

  selectedStatusValue: number = -1;

  constructor(private apiService: ApiService, private ticketUpdateService: TicketUpdateService, private loadingService: LoadingService, private translate: TranslateService) {
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
      this.apiService.changeTicketStatus(parseInt(localStorage.getItem('selectedTicket')!), this.selectedStatusValue).subscribe({
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

}
