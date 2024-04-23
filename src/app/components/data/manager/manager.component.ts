import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { iUserGraph } from 'src/app/models/users/iUserGraph';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketUpdateService } from 'src/app/services/ticketUpdate.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  users: iUserGraph[] = [];
  public priorities: string[] = ['NOT_SURE', 'LOWEST', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST'];
  public states: string[] = ['PENDING', 'OPENED', 'PAUSED', 'FINISHED'];
  selectedUserId: number = -1;
  selectedPriority: string = '';
  selectedPriorityValue: number = -1;
  selectedState: string = '';
  selectedStateValue: number = -1;
  isWorking: boolean = false;

  constructor(private apiService: ApiService, private ticketUpdateService: TicketUpdateService, private loadingService: LoadingService, private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use('es');

    }
  }

  ngOnInit(): void {
    this.apiService.getTechnicians().subscribe({
      next: (response: any) => {
        const users: iUserGraph[] = response.map((value: any) => {
          return {
            id: value.id,
            userName: value.userName
          };
        });
        this.users = users;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  /**
   * Actualiza los datos de una incidencia. Técnico asignado, prioridad y/o estado.
   */
  updateTicket() {
    this.loadingService.showLoading();
    if (this.selectedUserId != -1) {
      this.apiService.assignTechnician(parseInt(localStorage.getItem('selectedTicket')!), this.selectedUserId).subscribe({
        next: () => {
          this.ticketUpdateService.triggerTicketUpdate();
          this.loadingService.hideLoading();
        },
        error: (error: any) => {
          console.error('Error al asignar técnico', error);
        }
      });
    }
    this.loadingService.showLoading();
    if (this.selectedPriorityValue != -1) {
      this.apiService.changeTicketPriority(parseInt(localStorage.getItem('selectedTicket')!), this.selectedPriorityValue).subscribe({
        next: () => {
          this.ticketUpdateService.triggerTicketUpdate();
          this.loadingService.hideLoading();
        },
        error: (error: any) => {
          console.error('Error al cambiar la prioridad', error);
        }
      });
    }
    this.loadingService.showLoading();
    if (this.selectedStateValue != -1) {
      this.apiService.changeTicketState(parseInt(localStorage.getItem('selectedTicket')!), this.selectedStateValue).subscribe({
        next: () => {
          this.ticketUpdateService.triggerTicketUpdate();
          this.loadingService.hideLoading();
        },
        error: (error: any) => {
          console.error('Error al cambiar el estado', error);
        }
      })
    }
    this.ticketUpdateService.triggerTicketUpdate();
  }
}
