import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketDto } from 'src/app/models/tickets/TicketDTO';
import { TicketFilterRequestDto } from 'src/app/models/tickets/TicketFilterRequestDto';
import { iTicket } from 'src/app/models/tickets/iTicket';
import { iTicketFilterDto } from 'src/app/models/tickets/iTicketFilterDto';
import { iTicketUserDto } from 'src/app/models/tickets/iTicketUserDto';
import { Tickets } from 'src/app/utilities/enum-http-routes';
import { LocalStorageKeys } from 'src/app/utilities/literals';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  

  constructor(private http: HttpClient) { }


  /**
   * Obtiene todas las incidencias de la base de datos.
   * @returns Observable<iTicket[]> con todas las incidencias.
   */
  getTickets(): Observable<iTicket[]> {
    const token = localStorage.getItem(LocalStorageKeys.tokenKey);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<iTicket[]>(`${environment.apiUrl}` + Tickets.getTickets, { headers });
  }

  /**
   * Obtiene todas las incidencias de la base de datos con el nombre del técnico asignado.
   * @returns Observable<iTicketUserDto[]> con todas las incidencias.
   */
  getTicketsWithNames(): Observable<iTicketUserDto[]> {
    const token = localStorage.getItem(LocalStorageKeys.tokenKey);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<iTicketUserDto[]>(`${environment.apiUrl}` + Tickets.getTicketsWithNames, { headers });
  }

  /**
   * Obtiene todas las incidencias sin terminar de la base de datos.
   * @returns Observable<iTicket[]> con todas las incidencias sin terminar.
   */
  getNoFinished(): Observable<iTicket[]> {
    const token = localStorage.getItem(LocalStorageKeys.tokenKey);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<iTicket[]>(`${environment.apiUrl}` + Tickets.getNoFInished, { headers });
  }

  /**
   * Filtra las incidencias según los datos pasados como parámetro.
   * @param filter los datos de filtrado
   * @returns Observable<iTicket[]> con las incidencias.
   */
  filterTickets(filter: TicketFilterRequestDto): Observable<iTicketFilterDto> {
    const token = localStorage.getItem(LocalStorageKeys.tokenKey);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<iTicketFilterDto>(`${environment.apiUrl}` + Tickets.filterTickets, {
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
    return this.http.post<boolean>(`${environment.apiUrl}` + Tickets.createTicket, formData);
  }

  /**
   * Obtiene las incidencias asignadas al usuario con el ID pasado como parámetro.
   * @param userId el id del usuario.
   * @returns Observable<iTicket[]> con las incidencias.
   */
  getTicketsByUser(userId: number): Observable<iTicket[]> {
    const token = localStorage.getItem(LocalStorageKeys.tokenKey);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<iTicket[]>(`${environment.apiUrl}` +  Tickets.getTicketsByUser + `${userId}`, { headers });
  }

  /**
   * Obtiene las incidencias + nombre de técnico asignadas al técnico con el ID pasado como parámetro.
   * @param userId el id del usuario.
   * @returns Observable<iTicketUserDto[]> con las incidencias.
   */
  getTicketsByUserWithNames(userId: number): Observable<iTicketUserDto[]> {
    const token = localStorage.getItem(LocalStorageKeys.tokenKey);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<iTicketUserDto[]>(`${environment.apiUrl}` + Tickets.getTicketsByUserWithNames + `${userId}`, { headers });
  }

  /**
   * Obtiene una incidencia por su ID.
   * @param ticketId el id de la incidencia.
   * @returns Observable<iTicket> con la incidencia.
   */
  getTicketById(ticketId: number): Observable<iTicket> {
    return this.http.get<iTicket>(`${environment.apiUrl}` + Tickets.getTicketById + `${ticketId}`);
  }

   /**
   * Obtiene una incidencia con el nombre del técnico asignado por su ID.
   * @param ticketId el id de la incidencia.
   * @returns Observable<iTicket> con la incidencia.
   */
   getTicketByIdWithName(ticketId: number): Observable<iTicketUserDto> {
    return this.http.get<iTicketUserDto>(`${environment.apiUrl}` + Tickets.getTicketByIdWithName + `${ticketId}`);
  }
  
  /**
   * Asigna una incidencia a un técnico.
   * @param ticketId el id de la incidencia.
   * @param userId el id del técnico.
   * @returns 
   */
  assignTechnician(ticketId: number, userId: number): Observable<boolean> {
    const token = localStorage.getItem(LocalStorageKeys.tokenKey);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<boolean>(`${environment.apiUrl}` + Tickets.assignTechnician + `${ticketId}/${userId}`, null, {headers});
  }

  /**
   * Actualiza los datos de una incidencia.
   * @param ticketId el id de la incidencia.
   * @param newTicket TicketDto con los nuevos datos.
   * @returns 
   */
  updateTicket(ticketId: number, newTicket: TicketDto): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}` + Tickets.updateTicket + `${ticketId}`, newTicket);
  }

  /**
   * Cambia la prioridad de una incidencia.
   * @param ticketId el id de la incidencia.
   * @param priority el valor de la nueva prioridad.
   * @returns 
   */
  changeTicketPriority(ticketId: number, priority: number): Observable<boolean> {
    const token = localStorage.getItem(LocalStorageKeys.tokenKey);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<boolean>(`${environment.apiUrl}` + Tickets.changeTicketPriority + `${ticketId}/${priority}`, null, {headers});
  }

  /**
   * Cambia el estado de una incidencia.
   * @param ticketId el id de la incidencia.
   * @param status el valor del nuevo estado.
   * @returns 
   */
  changeTicketStatus(ticketId: number, status: number): Observable<boolean> {
    const token = localStorage.getItem(LocalStorageKeys.tokenKey);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<boolean>(`${environment.apiUrl}` + Tickets.changeTicketStatus + `${ticketId}/${status}`, null, {headers});
  }
}