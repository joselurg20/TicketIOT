import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { iUserGraph } from 'src/app/models/users/iUserGraph';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketUpdateService } from 'src/app/services/tickets/ticketUpdate.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'src/app/services/loading.service';
import { TicketDataService } from 'src/app/services/tickets/ticketData.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  users: iUserGraph[] = [];
  selectedUserId: number = -1;
  selectedPriorityValue: number = -1;
  selectedStatusValue: number = -1;
  isWorking: boolean = false;

  constructor(private ticketDataService: TicketDataService, private ticketUpdateService: TicketUpdateService,
              private loadingService: LoadingService, private translate: TranslateService,
              private ticketsService: TicketsService) {
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use('es');

    }
  }

  ngOnInit(): void {
    this.ticketDataService.usersFN$.subscribe({
      next: (response: iUserGraph[]) => {
        const users = response.map((value: iUserGraph) => {
          return {
            id: value.id,
            userName: value.userName,
            fullName: value.fullName
          };
        })
        this.users = users;
      },
      error: (error: any) => {
        console.error('Error al obtener los usuarios', error);
      }
    })
  }

  /**
   * Asigna la incidencia seleccionada a un técnico.
   */
  assignTicket() {
    if (this.selectedUserId != -1) {
      this.loadingService.showLoading();
      this.ticketsService.assignTechnician(parseInt(localStorage.getItem('selectedTicket')!), this.selectedUserId).subscribe({
        next: () => {
          this.ticketUpdateService.triggerTicketUpdate();
          this.loadingService.hideLoading();
        },
        error: (error: any) => {
          console.error('Error al asignar técnico', error);
        }
      });
    }
  }

  /**
   * Cambia la prioridad a la incidencia seleccionada.
   */
  updatePrio() {
    if (this.selectedPriorityValue != -1) {
      this.loadingService.showLoading();
      this.ticketsService.changeTicketPriority(parseInt(localStorage.getItem('selectedTicket')!), this.selectedPriorityValue).subscribe({
        next: () => {
          this.ticketUpdateService.triggerTicketUpdate();
          this.loadingService.hideLoading();
        },
        error: (error: any) => {
          console.error('Error al cambiar la prioridad', error);
        }
      });
    }
  }

  /**
   * Cambia el estado a la incidencia seleccionada.
   */
  updateStatus() {
    if (this.selectedStatusValue != -1) {
      this.loadingService.showLoading();
      this.ticketsService.changeTicketStatus(parseInt(localStorage.getItem('selectedTicket')!), this.selectedStatusValue).subscribe({
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
