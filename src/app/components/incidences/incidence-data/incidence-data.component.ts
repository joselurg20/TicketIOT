import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { iTicketDescriptor } from 'src/app/models/tickets/iTicketDescription';
import { ApiService } from 'src/app/services/api.service';
import { TicketUpdateService } from 'src/app/services/ticketUpdate.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-incidence-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './incidence-data.component.html',
  styleUrls: ['./incidence-data.component.scss']
})
export class IncidenceDataComponent implements OnInit {

  ticket: iTicketDescriptor = {id: 0, title: '', name: '', email: '', timestamp: '', priority: '', state: '', userId: '0', userName: ''};
  private ticketUpdateSubscription: Subscription = {} as Subscription;

  constructor(private apiService: ApiService, private ticketUpdateService: TicketUpdateService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.apiService.getTicketById(parseInt(localStorage.getItem('selectedTicket')!)).subscribe({
      next: (response: any) => {
        console.log('Ticket recibido', response);
        // Mapear la respuesta de la API utilizando la interfaz iTicketTable
        const ticket: iTicketDescriptor = {
            id: response.id,
            title: response.title,
            name: response.name,
            email: response.email,
            timestamp: this.formatDate(response.timestamp),
            priority: response.priority,
            state: response.state,
            userId: response.userId,
            userName: ''
          };
        if(response.userId != -1){
          this.apiService.getUserById(parseInt(ticket.userId)).subscribe({
            next: (response: any) => {
              ticket.userName = response.userName;
              
              this.ticket = ticket;
            },
            error: (error: any) => {
              console.error('Error al obtener el usuario', error);
            }
          });
        }else{
          this.ticket = ticket;
          this.ticket.userId = '';
          this.ticket.userName = 'Sin asignar';
        }
      },
      error: (error: any) => {
        console.error('Error al obtener los tickets del usuario:', error);
      }
    });
    
    this.ticketUpdateSubscription = this.ticketUpdateService.ticketUpdated$.subscribe(() => {
      console.log('Ticket update received');
      
      this.refreshTicketData();
    });
  }

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

  ngOnDestroy(): void {
    this.ticketUpdateSubscription.unsubscribe();
  }

  refreshTicketData() {
    const selectedTicketId = parseInt(localStorage.getItem('selectedTicket')!);
    this.apiService.getTicketById(selectedTicketId).subscribe({
      next: (response: any) => {
        // Actualizar solo los campos que han cambiado
        if (this.ticket.userId !== response.userId) {
          this.ticket.userId = response.userId;
          // Obtener el nombre de usuario actualizado
          this.apiService.getUserById(response.userId).subscribe({
            next: (userResponse: any) => {
              this.ticket.userName = userResponse.userName;
              this.cdr.detectChanges();
            },
            error: (error: any) => {
              console.error('Error al obtener el usuario', error);
            }
          });
        }
        console.log('Nueva prioridad', response.priority);
        if (this.ticket.priority !== response.priority) {
          this.ticket.priority = response.priority;
          console.log('Nueva prioridad', this.ticket.priority);
          this.cdr.detectChanges();
        }
        if (this.ticket.state !== response.state) {
          this.ticket.state = response.state;
          this.cdr.detectChanges();
        }
      },
      error: (error: any) => {
        console.error('Error al obtener el ticket', error);
      }
    });
  }
 
}
