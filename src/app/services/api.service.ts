import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketDto } from '../models/tickets/TicketDTO';
import { TicketFilterRequestDto } from '../models/tickets/TicketFilterRequestDto';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://localhost:7131/gateway';
  

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los usuarios.
   * @returns Observable<any[]> con todos los usuarios.
   */
  getUsers(): Observable<any[]> {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/Users/users/getall`, { headers });
  }

  /**
   * Obtiene un usuario por su ID.
   * @param userId el Id del usuario.
   * @returns Observable<any[]> con el usuario obtenido.
   */
  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Users/users/getbyid/${userId}`);
  }

  /**
   * Obtiene todos los usuarios con rol 'SupportTechnician'.
   * @returns Observable<any[]> con los técnicos.
   */
  getTechnicians(): Observable<any> {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/Users/users/gettechnicians`, { headers });
  }

  /**
   * Comprueba si un correo existe en la base de datos y, si existe envía un mail
   * de recuperación de contraseña.
   * @param username el nombre del email.
   * @param domain el dominio del email.
   * @param tld la terminación del email.
   * @returns 
   */
  checkEmail(username: string, domain: string, tld: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Users/users/sendemail/${username}/${domain}/${tld}`);
  }

  /**
   * Cambia la contraseña de un usuario por la pasada como parámetro.
   * @param formData FormData con la nueva contraseña.
   * @returns 
   */
  resetPassword(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Users/users/resetpassword`, formData);
  }

  /**
   * Obtiene todas las incidencias de la base de datos.
   * @returns Observable<any[]> con todas las incidencias.
   */
  getTickets(): Observable<any[]> {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<any[]>(`${this.apiUrl}/tickets/getall`, { headers });
  }

  /**
   * Filtra las incidencias según los datos pasados como parámetro.
   * @param filter los datos de filtrado
   * @returns Observable<any[]> con las incidencias.
   */
  filterTickets(filter: TicketFilterRequestDto): Observable<any[]> {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/tickets/getallfilter`, {
      headers: headers,
      params: new HttpParams()
        .set("State", filter.state)
        .set("Priority", filter.priority)
        .set("UserId", filter.userId)
        .set("Start", filter.start.toDateString())
        .set("End", filter.end.toDateString())
    });
  }

  /**
   * Crea una nueva incidencia con los datos pasados como parámetro.
   * @param formData FormData con los datos de la nueva incidencia.
   * @returns 
   */
  createTicket(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tickets/create`, formData);
  }

  /**
   * Obtiene las incidencias asignadas al usuario con el ID pasado como parámetro.
   * @param userId el id del usuario.
   * @returns Observable<any[]> con las incidencias.
   */
  getTicketsByUser(userId: number): Observable<any[]> {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/tickets/getbyuser/${userId}`, { headers });
  }

  /**
   * Obtiene una incidencia por su ID.
   * @param ticketId el id de la incidencia.
   * @returns Observable<any[]> con la incidencia.
   */
  getTicketById(ticketId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tickets/getbyid/${ticketId}`);
  }

  /**
   * Obtiene los mensajes de una incidencia por su ID.
   * @param ticketId el id de la incidencia.
   * @returns Observable<any[]> con los mensajes.
   */
  getMessagesByTicket(ticketId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/messages/getbyticket/${ticketId}`);
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
  assignTechnician(ticketId: number, userId: number) {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(`${this.apiUrl}/tickets/asign/${ticketId}/${userId}`, null, {headers});
  }

  /**
   * Actualiza los datos de una incidencia.
   * @param ticketId el id de la incidencia.
   * @param newTicket TicketDto con los nuevos datos.
   * @returns 
   */
  updateTicket(ticketId: number, newTicket: TicketDto) {
    return this.http.put<any>(`${this.apiUrl}/tickets/update/${ticketId}`, newTicket);
  }

  /**
   * Cambia la prioridad de una incidencia.
   * @param ticketId el id de la incidencia.
   * @param priority el valor de la nueva prioridad.
   * @returns 
   */
  changeTicketPriority(ticketId: number, priority: number) {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(`${this.apiUrl}/tickets/changepriority/${ticketId}/${priority}`, null, {headers});
  }

  /**
   * Cambia el estado de una incidencia.
   * @param ticketId el id de la incidencia.
   * @param state el valor del nuevo estado.
   * @returns 
   */
  changeTicketState(ticketId: number, state: number) {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(`${this.apiUrl}/tickets/changestate/${ticketId}/${state}`, null, {headers});
  }

  /**
   * Crea un nuevo mensaje para una incidencia.
   * @param formData FormData con los datos del mensaje.
   * @returns 
   */
  createMessage(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/messages/create`, formData);
  }
}