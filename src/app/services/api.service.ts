import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketDto } from '../models/tickets/TicketDTO';
import { TicketFilterRequestDto } from '../models/tickets/TicketFilterRequestDto';
import { iUser } from '../models/users/iUser';
import { iTicket } from '../models/tickets/iTicket';
import { iMessage } from '../models/tickets/iMessage';
import { FilterTicketJsonResult, MessageJsonResult, TicketJsonResult, UserJsonResult } from '../models/JsonResult';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://localhost:7131/gateway';
  

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los usuarios.
   * @returns Observable<iUser[]> con todos los usuarios.
   */
  getUsers(): Observable<UserJsonResult> {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<UserJsonResult>(`${this.apiUrl}/Users/users/getall`, { headers });
  }

  /**
   * Obtiene un usuario por su ID.
   * @param userId el Id del usuario.
   * @returns Observable<iuser> con el usuario obtenido.
   */
  getUserById(userId: number): Observable<iUser> {
    return this.http.get<iUser>(`${this.apiUrl}/Users/users/getbyid/${userId}`);
  }

  /**
   * Obtiene todos los usuarios con rol 'SupportTechnician'.
   * @returns Observable<iUser[]> con los técnicos.
   */
  getTechnicians(): Observable<UserJsonResult> {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<UserJsonResult>(`${this.apiUrl}/Users/users/gettechnicians`, { headers });
  }

  /**
   * Comprueba si un correo existe en la base de datos y, si existe envía un mail
   * de recuperación de contraseña.
   * @param username el nombre del email.
   * @param domain el dominio del email.
   * @param tld la terminación del email.
   * @returns 
   */
  checkEmail(username: string, domain: string, tld: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/Users/users/sendemail/${username}/${domain}/${tld}`);
  }

  /**
   * Cambia la contraseña de un usuario por la pasada como parámetro.
   * @param formData FormData con la nueva contraseña.
   * @returns 
   */
  resetPassword(formData: FormData): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/Users/users/resetpassword`, formData);
  }

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
   * Obtiene los mensajes de una incidencia por su ID.
   * @param ticketId el id de la incidencia.
   * @returns Observable<iMessage[]> con los mensajes.
   */
  getMessagesByTicket(ticketId: number): Observable<MessageJsonResult> {
    return this.http.get<MessageJsonResult>(`${this.apiUrl}/messages/getbyticket/${ticketId}`);
  }

  /**
   * Descarga un archivo del servidor.
   * @param attachmentPath ruta del archivo.
   * @param ticketId el id de la incidencia a la que pertenece.
   * @returns Observable<Blob> con el archivo.
   */
  downloadAttachment(attachmentPath: string, ticketId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/messages/download/${ticketId}/${attachmentPath}`, { responseType: 'blob' });
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

  /**
   * Crea un nuevo mensaje para una incidencia.
   * @param formData FormData con los datos del mensaje.
   * @returns 
   */
  createMessage(formData: FormData): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/messages/create`, formData);
  }
}