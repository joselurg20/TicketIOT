import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketDto } from '../models/tickets/TicketDTO';
import { iResetPasswordDto } from '../models/users/iResetPasswordDto';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://localhost:7131/gateway';
  

  constructor(private http: HttpClient) { }

  // Método para obtener la lista de usuarios
  getUsers(): Observable<any[]> {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/Users/users/getall`, { headers });
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Users/users/getbyid/${userId}`);
  }

  getTechnicians(): Observable<any> {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/Users/users/gettechnicians`, { headers });
  }

  checkEmail(username: string, domain: string, tld: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Users/users/sendemail/${username}/${domain}/${tld}`);
  }

  resetPassword(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Users/users/resetpassword`, formData);
  }

  getTickets(): Observable<any[]> {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<any[]>(`${this.apiUrl}/tickets/getall`, { headers });
  }

  createTicket(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tickets/create`, formData);
  }

  getTicketsByUser(userId: number): Observable<any[]> {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/tickets/getbyuser/${userId}`, { headers });
  }

  getTicketById(ticketId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tickets/getbyid/${ticketId}`);
  }

  getMessagesByTicket(ticketId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages/getbyticket/${ticketId}`);
  }

  downloadAttachment(attachmentPath: string, ticketId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/messages/download/${ticketId}/${attachmentPath}`, { responseType: 'blob' });
  }
  
  assignTechnician(ticketId: number, userId: number) {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(`${this.apiUrl}/tickets/asign/${ticketId}/${userId}`, null, {headers});
  }

  updateTicket(ticketId: number, newTicket: TicketDto) {
    return this.http.put<any>(`${this.apiUrl}/tickets/update/${ticketId}`, newTicket);
  }

  changeTicketPriority(ticketId: number, priority: number) {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(`${this.apiUrl}/tickets/changepriority/${ticketId}/${priority}`, null, {headers});
  }
  changeTicketState(ticketId: number, state: number) {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(`${this.apiUrl}/tickets/changestate/${ticketId}/${state}`, null, {headers});
  }

  createMessage(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/messages/create`, formData);
  }
}