import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketUpdateService {
  private ticketUpdatedSource = new Subject<void>();

  ticketUpdated$ = this.ticketUpdatedSource.asObservable();

  triggerTicketUpdate() {
    console.log('Ticket update triggered')
    this.ticketUpdatedSource.next();
  }
}