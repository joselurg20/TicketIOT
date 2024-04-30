import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterTicketJsonResult, TicketJsonResult } from 'src/app/models/JsonResult';
import { TicketDto } from 'src/app/models/tickets/TicketDTO';
import { TicketFilterRequestDto } from 'src/app/models/tickets/TicketFilterRequestDto';
import { iTicket } from 'src/app/models/tickets/iTicket';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private apiUrl = 'https://localhost:7131/gateway';
  

  constructor(private http: HttpClient) { }


  /**
   * Obtiene todas las incidencias de la base de datos.
   * @returns Observable<iTicket[]> con todas las incidencias.
   */
  getTickets(): Observable<TicketJsonResult> {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<TicketJsonResult>(`${this.apiUrl}/tickets/getall`, { headers });
  }

  /**
   * Filtra las incidencias según los datos pasados como parámetro.
   * @param filter los datos de filtrado
   * @returns Observable<iTicket[]> con las incidencias.
   */
  filterTickets(filter: TicketFilterRequestDto): Observable<FilterTicketJsonResult> {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<FilterTicketJsonResult>(`${this.apiUrl}/tickets/getallfilter`, {
      headers: headers,
      params: new HttpParams()
        .set("Status", filter.status)
        .set("Priority", filter.priority)
        .set("UserId", filter.userId)
        .set("Start", filter.start.toDateString())
        .set("End", filter.end.toDateString())
        .set("SearchString", filter.searchString)
    });
  }

  /**
   * Crea una nueva incidencia con los datos pasados como parámetro.
   * @param formData FormData con los datos de la nueva incidencia.
   * @returns 
   */
  createTicket(formData: FormData): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/tickets/create`, formData);
  }

  /**
   * Obtiene las incidencias asignadas al usuario con el ID pasado como parámetro.
   * @param userId el id del usuario.
   * @returns Observable<iTicket[]> con las incidencias.
   */
  getTicketsByUser(userId: number): Observable<TicketJsonResult> {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<TicketJsonResult>(`${this.apiUrl}/tickets/getbyuser/${userId}`, { headers });
  }

  /**
   * Obtiene una incidencia por su ID.
   * @param ticketId el id de la incidencia.
   * @returns Observable<iTicket> con la incidencia.
   */
  getTicketById(ticketId: number): Observable<iTicket> {
    return this.http.get<iTicket>(`${this.apiUrl}/tickets/getbyid/${ticketId}`);
  }
  
  /**
   * Asigna una incidencia a un técnico.
   * @param ticketId el id de la incidencia.
   * @param userId el id del técnico.
   * @returns 
   */
  assignTechnician(ticketId: number, userId: number): Observable<boolean> {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<boolean>(`${this.apiUrl}/tickets/asign/${ticketId}/${userId}`, null, {headers});
  }

  /**
   * Actualiza los datos de una incidencia.
   * @param ticketId el id de la incidencia.
   * @param newTicket TicketDto con los nuevos datos.
   * @returns 
   */
  updateTicket(ticketId: number, newTicket: TicketDto): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/tickets/update/${ticketId}`, newTicket);
  }

  /**
   * Cambia la prioridad de una incidencia.
   * @param ticketId el id de la incidencia.
   * @param priority el valor de la nueva prioridad.
   * @returns 
   */
  changeTicketPriority(ticketId: number, priority: number): Observable<boolean> {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<boolean>(`${this.apiUrl}/tickets/changepriority/${ticketId}/${priority}`, null, {headers});
  }

  /**
   * Cambia el estado de una incidencia.
   * @param ticketId el id de la incidencia.
   * @param status el valor del nuevo estado.
   * @returns 
   */
  changeTicketStatus(ticketId: number, status: number): Observable<boolean> {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<boolean>(`${this.apiUrl}/tickets/changestatus/${ticketId}/${status}`, null, {headers});
  }
}