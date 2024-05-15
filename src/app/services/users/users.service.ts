import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { iUser } from 'src/app/models/users/iUser';
import { Users } from 'src/app/utilities/enum-http-routes';
import { LocalStorageKeys } from 'src/app/utilities/literals';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  currentUser: iUser | null = {} as iUser;
  

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los usuarios.
   * @returns Observable<iUser[]> con todos los usuarios.
   */
  getUsers(): Observable<iUser[]> {
    const token = localStorage.getItem(LocalStorageKeys.tokenKey);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<iUser[]>(`${environment.apiUrl}` + Users.getUsers, { headers });
  }

  /**
   * Obtiene un usuario por su ID.
   * @param userId el Id del usuario.
   * @returns Observable<iuser> con el usuario obtenido.
   */
  getUserById(userId: number): Observable<iUser> {
    console.log('url peticion', `${environment.apiUrl}` + Users.getUserById + `${userId}`)
    return this.http.get<iUser>(`${environment.apiUrl}` + Users.getUserById + `${userId}`);
  }

  /**
   * Obtiene todos los usuarios con rol 'SupportTechnician'.
   * @returns Observable<iUser[]> con los técnicos.
   */
  getTechnicians(): Observable<iUser[]> {
    const token = localStorage.getItem(LocalStorageKeys.tokenKey);
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<iUser[]>(`${environment.apiUrl}` + Users.getTechnicians, { headers });
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
    return this.http.get<boolean>(`${environment.apiUrl}` + Users.checkEmail + `${username}/${domain}/${tld}`);
  }

  /**
   * Cambia la contraseña de un usuario por la pasada como parámetro.
   * @param formData FormData con la nueva contraseña.
   * @returns 
   */
  resetPassword(formData: FormData): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}` + Users.resetPassword, formData);
  }
}