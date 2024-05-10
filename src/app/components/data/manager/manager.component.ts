import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { iUserGraph } from 'src/app/models/users/iUserGraph';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TicketUpdateService } from 'src/app/services/tickets/ticketUpdate.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingService } from 'src/app/services/loading.service';
import { TicketDataService } from 'src/app/services/tickets/ticketData.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { LocalStorageKeys } from 'src/app/utilities/literals';
import { Priorities, Status } from 'src/app/utilities/enum';
import { Router } from '@angular/router';
import { Routes } from 'src/app/utilities/routes';
import { Utils } from 'src/app/utilities/utils';
import { UserDataService } from 'src/app/services/users/userData.service';

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
  priorities: Priorities[] = Object.values(Priorities).filter(value => typeof value === 'number') as Priorities[];
  status: Status[] = Object.values(Status).filter(value => typeof value === 'number') as Status[];

  constructor(private ticketDataService: TicketDataService, private ticketUpdateService: TicketUpdateService,
              private loadingService: LoadingService, private translate: TranslateService,
              private ticketsService: TicketsService, private router: Router,
              private userDataService: UserDataService) {
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use('es');

    }
  }

  ngOnInit(): void {
    this.userDataService.usersFN$.subscribe({
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
      this.ticketsService.assignTechnician(parseInt(localStorage.getItem(LocalStorageKeys.selectedTicket)!), this.selectedUserId).subscribe({
        next: () => {
          this.ticketUpdateService.triggerTicketUpdate();
          this.loadingService.hideLoading();
          this.router.navigate([Routes.supportManager]);
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
      this.ticketsService.changeTicketPriority(parseInt(localStorage.getItem(LocalStorageKeys.selectedTicket)!), this.selectedPriorityValue).subscribe({
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
    return Utils.getPriorityString(priority);
  }

  /**
   * Obtiene el texto a representar en función del estado y el idioma.
   * @param status el estado.
   * @returns la cadena de texto a representar.
   */
  getStatusString(status: number): string {
    return Utils.getStatusString(status);
  }
}
