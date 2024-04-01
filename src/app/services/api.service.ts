import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://localhost:7233/api'; // URL base de tu API

  constructor(private http: HttpClient) { }

  // Método para obtener la lista de usuarios
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/User`);
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User/${userId}`);
  }

  getTickets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Ticket`);
  }

  getTicketsByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Ticket/tickets-${userId}`);
  }

  getTicketById(ticketId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Ticket/${ticketId}`);
  }

  getMessagesByTicket(ticketId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Message/messages-ticket${ticketId}`);
  }

  downloadAttachment(attachmentPath: string) {
    return this.http.get<any>(`${this.apiUrl}/Message/download/${attachmentPath}`);
  }
  
  assignTechnician(ticketId: number, userId: number) {
    return this.http.put<any>(`${this.apiUrl}/Ticket/${ticketId}-asign-${userId}`, null);
  }
  changeTicketPriority(ticketId: number, priority: number) {
    return this.http.put<any>(`${this.apiUrl}/Ticket/${ticketId}-prio-${priority}`, null);
  }
  changeTicketState(ticketId: number, state: number) {
    return this.http.put<any>(`${this.apiUrl}/Ticket/${ticketId}-state-${state}`, null);
  }
}