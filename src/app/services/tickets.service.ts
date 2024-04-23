import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { iTicketTableSM } from '../models/tickets/iTicketTableSM';
import { iTicketGraph } from '../models/tickets/iTicketsGraph';
import { TicketFilterRequestDto } from '../models/tickets/TicketFilterRequestDto';
import { iUserTable } from '../models/users/iUserTable';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  
private ticketsSubject: BehaviorSubject<iTicketTableSM[]> = new BehaviorSubject<iTicketTableSM[]>([]);
tickets$: Observable<iTicketTableSM[]> = this.ticketsSubject.asObservable();
private ticketGraphsSubject: BehaviorSubject<iTicketGraph[]> = new BehaviorSubject<iTicketGraph[]>([]);
ticketGraphs$: Observable<iTicketGraph[]> = this.ticketGraphsSubject.asObservable();

  constructor(private apiService: ApiService) { }

  /**
   * Obtiene las incidencias de la api
   * @param isSupportManager boolean para saber si el usuario es SupportManager
   */
  getTickets(isSupportManager: boolean) {
    if (isSupportManager) {
      this.apiService.getTicketsByUser(-1).subscribe({
        next: (response: any) => {
          const tickets: iTicketTableSM[] = response.$values.map((value: any) => {
            return {
                id: value.id,
                title: value.title,
                name: value.name,
                email: value.email,
                timestamp: this.formatDate(value.timestamp),
                priority: value.priority,
                state: value.state,
                techName: 'Sin asignar'
              };
          });
          const ticketGraphs: iTicketGraph[] = response.$values.map((value: any) => {
            return {
                priority: value.priority,
                state: value.state,
                userId: value.userId
              };
          });
          this.ticketsSubject.next(tickets);
          this.ticketGraphsSubject.next(ticketGraphs);
        },
        error: (error: any) => {
          console.error('Error al obtener los tickets del usuario:', error);
        }
      });
    } else {
        this.apiService.getTicketsByUser(parseInt(localStorage.getItem('userId')!)).subscribe({
            next: (response: any) => {
              const tickets: iTicketTableSM[] = response.$values.map((value: any) => {
                return {
                  id: value.id,
                  title: value.title,
                  name: value.name,
                  email: value.email,
                  timestamp: this.formatDate(value.timestamp),
                  priority: value.priority,
                  state: value.state,
                  hasNewMessages: value.hasNewMessages,
                  newMessagesCount: value.newMessagesCount
                };
              });
              const ticketGraphs: iTicketGraph[] = response.$values.map((value: any) => {
                return {
                    priority: value.priority,
                    state: value.state,
                    userId: value.userId
                  };
              });
              this.apiService.getUserById(parseInt(localStorage.getItem('userId')!)).subscribe({
                next: (response: any) => {
                  tickets.forEach((ticket: iTicketTableSM) => {
                    ticket.techName = response.fullName;
                  });
                },
                error: (error: any) => {
                  console.error('Error al obtener el usuario:', error);
                }
              })
              for (let ticket of tickets) {
                if (ticket.state == 'FINISHED') {
                  tickets.splice(tickets.indexOf(ticket), 1);
                  ticketGraphs.splice(tickets.indexOf(ticket), 1);
                }
              }
              this.ticketsSubject.next(tickets);
              this.ticketGraphsSubject.next(ticketGraphs);
            },
            error: (error: any) => {
              console.error('Error al obtener los tickets del usuario:', error);
            }
          });
    }
  }

  filterTickets(filter: TicketFilterRequestDto) {
    filter.state = +filter.state;
    filter.priority = +filter.priority;
    this.apiService.filterTickets(filter).subscribe({
        next: (response: any) => {
          const tickets: iTicketTableSM[] = response.tickets.$values.map((value: any) => {
            return {
              id: value.id,
              title: value.title,
              name: value.name,
              email: value.email,
              timestamp: this.formatDate(value.timestamp),
              priority: value.priority,
              state: value.state,
              techId: value.userId,
              techName: ''
            };
          });
          const ticketGraphs: iTicketGraph[] = response.tickets.$values.map((value: any) => {
            return {
                priority: value.priority,
                state: value.state,
                userId: value.userId
              };
          });
          this.apiService.getUsers().subscribe({
            next: (response: any) => {
              const users: iUserTable[] = response.map((value: any) => {
                return {
                  id: value.id,
                  userName: value.fullName
                };
              });
              tickets.forEach((ticket) => {
                const user = users.find((user) => user.id === ticket.techId);
                if (user) {
                  ticket.techName = user.userName;
                } else {
                  ticket.techName = 'Sin asignar'
                }
              });
              this.ticketsSubject.next(tickets);
              this.ticketGraphsSubject.next(ticketGraphs);
            },
            error: (error: any) => {
              console.error('Error al obtener los tickets del usuario:', error);
            }
          })
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
}