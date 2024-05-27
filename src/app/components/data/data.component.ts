import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { iUserGraph } from 'src/app/models/users/iUserGraph';
import { LoadingService } from 'src/app/services/loading.service';
import { TicketDataService } from 'src/app/services/tickets/ticketData.service';
import { TicketUpdateService } from 'src/app/services/tickets/ticketUpdate.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { UserDataService } from 'src/app/services/users/userData.service';
import { UsersService } from 'src/app/services/users/users.service';
import { Priorities, Status } from 'src/app/utilities/enum';
import { LocalStorageKeys, Roles } from 'src/app/utilities/literals';
import { Routes } from 'src/app/utilities/routes';
import { Utils } from 'src/app/utilities/utils';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  
  users: iUserGraph[] = [];
  selectedUserId: number = -1;
  selectedPriorityValue: number = -1;
  selectedStatusValue: number = -1;
  isWorking: boolean = false;
  priorities: Priorities[] = Object.values(Priorities).filter(value => typeof value === 'number') as Priorities[];
  status: Status[] = Object.values(Status).filter(value => typeof value === 'number') as Status[];
  isSupportManager: boolean = false;

  constructor(
    private ticketDataService: TicketDataService, private usersService: UsersService, private ticketUpdateService: TicketUpdateService, 
    private loadingService: LoadingService, private translate: TranslateService, private ticketsService: TicketsService, private router: Router, private userDataService: UserDataService) {
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use('es');
    }
  }

  ngOnInit(): void {
    if (this.usersService.currentUser?.role === Roles.managerRole) {
      this.isSupportManager = true;
      this.userDataService.usersFN$.subscribe({
        next: (response: iUserGraph[]) => {
          const users = response.map((value: iUserGraph) => ({
            id: value.id,
            userName: value.userName,
            fullName: value.fullName
          }));
          this.users = users;

          // Cargar valores desde localStorage
          const storedUserId = localStorage.getItem(LocalStorageKeys.selectedUserId);
          if (storedUserId) {
            this.selectedUserId = parseInt(storedUserId);
          }
          const storedPriorityValue = localStorage.getItem(LocalStorageKeys.selectedPriorityValue);
          if (storedPriorityValue) {
            this.selectedPriorityValue = parseInt(storedPriorityValue);
          }
          const storedStatusValue = localStorage.getItem(LocalStorageKeys.selectedStatusValue);
          if (storedStatusValue) {
            this.selectedStatusValue = parseInt(storedStatusValue);
          }
        },
        error: (error: any) => {
          console.error('Error al obtener los usuarios', error);
        }
      });
    } else {
      this.isSupportManager = false;
    }
  }

  /**
   * Asigna la incidencia seleccionada a un técnico.
   */
  assignTicket() {
    if (this.selectedUserId != -1) {
      this.loadingService.showLoading();
      localStorage.setItem(LocalStorageKeys.selectedUserId, this.selectedUserId.toString()); // Guardar en localStorage
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
      localStorage.setItem(LocalStorageKeys.selectedPriorityValue, this.selectedPriorityValue.toString()); // Guardar en localStorage
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
      localStorage.setItem(LocalStorageKeys.selectedStatusValue, this.selectedStatusValue.toString()); // Guardar en localStorage
      this.ticketsService.changeTicketStatus(parseInt(localStorage.getItem(LocalStorageKeys.selectedTicket)!), this.selectedStatusValue).subscribe({
        next: () => {
          this.ticketUpdateService.triggerTicketUpdate();
          this.loadingService.hideLoading();
        },
        error: (error: any) => {
          console.error('Error al cambiar el estado', error);
        }
      });
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
