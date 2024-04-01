// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://localhost:7131/gateway';

  constructor(private http: HttpClient) { }

  // Método para obtener la lista de usuarios
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Users/users/getall`);
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Users/users/getbyid/${userId}`);
  }

  getTickets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tickets/getall`);
  }

  createTicket(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tickets/create`, formData);
  }

  getTicketsByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tickets/getbyuser/${userId}`);
  }

  getTicketById(ticketId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tickets/getbyid/${ticketId}`);
  }

  getMessagesByTicket(ticketId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages/getbyticket/${ticketId}`);
  }

  downloadAttachment(attachmentPath: string) {
    return this.http.get<any>(`${this.apiUrl}/messages/download/${attachmentPath}`);
  }
  
  assignTechnician(ticketId: number, userId: number) {
    return this.http.put<any>(`${this.apiUrl}/tickets/asign/${ticketId}-${userId}`, null);
  }
  changeTicketPriority(ticketId: number, priority: number) {
    return this.http.put<any>(`${this.apiUrl}/tickets/change-priority/${ticketId}-${priority}`, null);
  }
  changeTicketState(ticketId: number, state: number) {
    return this.http.put<any>(`${this.apiUrl}/tickets/change-state/${ticketId}-${state}`, null);
  }
}