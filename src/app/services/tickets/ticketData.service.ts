import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TicketFilterRequestDto } from '../../models/tickets/TicketFilterRequestDto';
import { iTicketTableSM } from '../../models/tickets/iTicketTableSM';
import { iTicketGraph } from '../../models/tickets/iTicketsGraph';
import { iUserGraph } from '../../models/users/iUserGraph';
import { LanguageUpdateService } from '../languageUpdateService';
import { iUserTable } from '../../models/users/iUserTable';
import { LoginService } from '../users/login.service';
import { iTicket } from '../../models/tickets/iTicket';
import { iUser } from '../../models/users/iUser';
import { TicketsService } from './tickets.service';
import { UsersService } from '../users/users.service';
import { iTicketFilterDto } from 'src/app/models/tickets/iTicketFilterDto';
import { iTicketUserDto } from 'src/app/models/tickets/iTicketUserDto';
import { LocalStorageKeys } from 'src/app/utilities/literals';

@Injectable({
  providedIn: 'root'
})
export class TicketDataService {
  
  private ticketsSubject: BehaviorSubject<iTicketTableSM[]> = new BehaviorSubject<iTicketTableSM[]>([]);
  tickets$: Observable<iTicketTableSM[]> = this.ticketsSubject.asObservable();
  private ticketGraphsSubject: BehaviorSubject<iTicketGraph[]> = new BehaviorSubject<iTicketGraph[]>([]);
  ticketGraphs$: Observable<iTicketGraph[]> = this.ticketGraphsSubject.asObservable();
  private usersSubject: BehaviorSubject<iUserGraph[]> = new BehaviorSubject<iUserGraph[]>([]);
  users$: Observable<iUserGraph[]> = this.usersSubject.asObservable();
  private usersGraphSubject: BehaviorSubject<iTicketGraph[]> = new BehaviorSubject<iTicketGraph[]>([]);
  usersGraph$: Observable<iTicketGraph[]> = this.usersGraphSubject.asObservable();
  private usersFNSubject: BehaviorSubject<iUserGraph[]> = new BehaviorSubject<iUserGraph[]>([]);
  usersFN$: Observable<iUserGraph[]> = this.usersFNSubject.asObservable();

  constructor(private ticketsService: TicketsService, private langUpdateService: LanguageUpdateService,
              private loginService: LoginService, private usersService: UsersService) { }


  /**
   * Obtiene las incidencias de la api
   * @param isSupportManager boolean para saber si el usuario es SupportManager
   */
  getTickets(isSupportManager: boolean) {
    if (isSupportManager) {
      this.ticketsService.getTicketsByUserWithNames(-1).subscribe({
        next: (response: iTicketUserDto[]) => {
          const tickets: iTicketTableSM[] = response.map((value: iTicketUserDto) => {
            return {
                id: value.id,
                title: value.title,
                name: value.name,
                email: value.email,
                timestamp: this.formatDate(value.timestamp),
                priority: value.priority,
                prioString: this.getPriorityString(value.priority),
                status: value.status,
                statusString: this.getStatusString(value.status),
                techName: value.fullName,
                techId: value.userId,
                hasNewMessages: value.hasNewMessages,
                newMessagesCount: value.newMessagesCount
              };
          });
          const ticketGraphs: iTicketGraph[] = response.map((value: iTicketGraph) => {
            return {
                priority: value.priority,
                status: value.status,
                userId: value.userId
              };
          });
          this.ticketsSubject.next(tickets);
          this.ticketGraphsSubject.next(ticketGraphs);
        },
        error: (error: any) => {
          console.error('Error al obtener los tickets:', error);
        }
      });
      
      this.ticketsService.getTickets().subscribe({
        next: (response: iTicket[]) => {
          const tickets: iTicketGraph[] = response.map((value: iTicketGraph) => {
            return {
                priority: value.priority,
                status: value.status,
                userId: value.userId
              };
          })
          this.usersGraphSubject.next(tickets);
        },
        error: (error: any) => {
          console.error('Error al obtener los tickets:', error);
        }
      })
    } else {
        this.ticketsService.getTicketsByUserWithNames(this.usersService.currentUser?.id!).subscribe({
            next: (response: iTicketUserDto[]) => {
              const tickets: iTicketTableSM[] = response.map((value: iTicketUserDto) => {
                return {
                  id: value.id,
                  title: value.title,
                  name: value.name,
                  email: value.email,
                  timestamp: this.formatDate(value.timestamp),
                  priority: value.priority,
                  prioString: this.getPriorityString(value.priority),
                  status: value.status,
                  statusString: this.getStatusString(value.status),
                  hasNewMessages: value.hasNewMessages,
                  newMessagesCount: value.newMessagesCount,
                  techId: value.userId,
                  techName: value.fullName
                };
              });
              const ticketGraphs: iTicketGraph[] = response.map((value: iTicketGraph) => {
                return {
                    priority: value.priority,
                    status: value.status,
                    userId: value.userId
                  };
              });
              for (let ticket of tickets) {
                if (ticket.status == 3) {
                  tickets.splice(tickets.indexOf(ticket), 1);
                  ticketGraphs.splice(tickets.indexOf(ticket), 1);
                }
              }
              console.log('Lanzando trigger de Tickets');
              this.ticketsSubject.next(tickets);
              console.log('Lanzando trigger de TicketGraphs');
              this.ticketGraphsSubject.next(ticketGraphs);
            },
            error: (error: any) => {
              console.error('Error al obtener los tickets del usuario:', error);
            }
          });
    }
  }

  getTechnicians() {
    this.usersService.getTechnicians().subscribe({
      next: (response: iUser[]) => {
        const users: iUserGraph[] = response.map((value: iUser) => {
          return {
            id: value.id,
            userName: value.userName,
            fullName: value.fullName
          }
        })
        const usersFN: iUserGraph[] = response.map((value: iUser) => {
          return {
            id: value.id,
            userName: value.fullName,
            fullName: value.fullName
          }
        })
        this.usersFNSubject.next(usersFN);
        this.usersSubject.next(users);
      },
      error: (error: any) => {
        console.error('Error al obtener los usuarios:', error);
      }
    });
  }

  filterTickets(filter: TicketFilterRequestDto) {
    filter.status = +filter.status;
    filter.priority = +filter.priority;
    filter.userId = +filter.userId;
    this.ticketsService.filterTickets(filter).subscribe({
        next: (response: iTicketFilterDto) => {
          const tickets: iTicketTableSM[] = response.tickets.map((value: iTicketUserDto) => {
            return {
              id: value.id,
              title: value.title,
              name: value.name,
              email: value.email,
              timestamp: this.formatDate(value.timestamp),
              priority: value.priority,
              prioString: this.getPriorityString(value.priority),
              status: value.status,
              statusString: this.getStatusString(value.status),
              techId: value.userId,
              techName: value.fullName,
              hasNewMessages: value.hasNewMessages,
              newMessagesCount: value.newMessagesCount
            };
          });
          const ticketGraphs: iTicketGraph[] = response.tickets.map((value: iTicket) => {
            return {
                priority: value.priority,
                status: value.status,
                userId: value.userId
              };
          });
          this.ticketsSubject.next(tickets);
          this.ticketGraphsSubject.next(ticketGraphs);
        },
        error: (error: any) => {
          console.error('Error al obtener los tickets filtrados:', error);
        }
      })
  }

  /**
   * Da formato a la fecha.
   * @param fecha la fecha a formatear.
   * @returns la fecha con formato 'DD/MM/AAAA - HH:mm:ss'
   */
  formatDate(fecha: string): string {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0'); // Se suma 1 porque los meses van de 0 a 11
    const año = fechaObj.getFullYear();
    const horas = fechaObj.getHours().toString().padStart(2, '0');
    const minutos = fechaObj.getMinutes().toString().padStart(2, '0');
    const segundos = fechaObj.getSeconds().toString().padStart(2, '0');

    return `${dia}/${mes}/${año} - ${horas}:${minutos}:${segundos}`;
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
          return 'FINALIZADA';
        default:
          return 'PENDIENTE';
      }
    }
    return '';
  }
}