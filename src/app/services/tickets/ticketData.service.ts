import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TicketFilterRequestDto } from '../../models/tickets/TicketFilterRequestDto';
import { iTicketTableSM } from '../../models/tickets/iTicketTableSM';
import { iTicketGraph } from '../../models/tickets/iTicketsGraph';
import { iTicket } from '../../models/tickets/iTicket';
import { TicketsService } from './tickets.service';
import { iTicketFilterDto } from 'src/app/models/tickets/iTicketFilterDto';
import { iTicketUserDto } from 'src/app/models/tickets/iTicketUserDto';
import { LocalStorageKeys } from 'src/app/utilities/literals';
import { Utils } from 'src/app/utilities/utils';

@Injectable({
  providedIn: 'root'
})
export class TicketDataService {
  
  private ticketsSubject: BehaviorSubject<iTicketTableSM[]> = new BehaviorSubject<iTicketTableSM[]>([]);
  tickets$: Observable<iTicketTableSM[]> = this.ticketsSubject.asObservable();
  private ticketGraphsSubject: BehaviorSubject<iTicketGraph[]> = new BehaviorSubject<iTicketGraph[]>([]);
  ticketGraphs$: Observable<iTicketGraph[]> = this.ticketGraphsSubject.asObservable();
  private usersGraphSubject: BehaviorSubject<iTicketGraph[]> = new BehaviorSubject<iTicketGraph[]>([]);
  usersGraph$: Observable<iTicketGraph[]> = this.usersGraphSubject.asObservable();
  

  constructor(private ticketsService: TicketsService) { }


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
                timestamp: Utils.formatDate(value.timestamp),
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
        this.ticketsService.getTicketsByUserWithNames(+localStorage.getItem(LocalStorageKeys.loggedUser)!).subscribe({
            next: (response: iTicketUserDto[]) => {
              const tickets: iTicketTableSM[] = response.map((value: iTicketUserDto) => {
                return {
                  id: value.id,
                  title: value.title,
                  name: value.name,
                  email: value.email,
                  timestamp: Utils.formatDate(value.timestamp),
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
              timestamp: Utils.formatDate(value.timestamp),
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