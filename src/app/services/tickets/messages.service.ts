import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { iMessage } from 'src/app/models/tickets/iMessage';
import { Messages } from 'src/app/utilities/enum-http-routes';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private apiUrl = 'https://localhost:7131/gateway';
  

  constructor(private http: HttpClient) { }

  
    /**
   * Obtiene los mensajes de una incidencia por su ID.
   * @param ticketId el id de la incidencia.
   * @returns Observable<iMessage[]> con los mensajes.
   */
  getMessagesByTicket(ticketId: number): Observable<iMessage[]> {
    return this.http.get<iMessage[]>(`${this.apiUrl}` + Messages.getByTicket + `${ticketId}`);
  }

  /**
   * Descarga un archivo del servidor.
   * @param attachmentPath ruta del archivo.
   * @param ticketId el id de la incidencia a la que pertenece.
   * @returns Observable<Blob> con el archivo.
   */
  downloadAttachment(attachmentPath: string, ticketId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}` + Messages.downloadAttachment + `${ticketId}/${attachmentPath}`, { responseType: 'blob' });
  }

  /**
   * Crea un nuevo mensaje para una incidencia.
   * @param formData FormData con los datos del mensaje.
   * @returns 
   */
  createMessage(formData: FormData): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}` + Messages.createMessage, formData);
  }
}