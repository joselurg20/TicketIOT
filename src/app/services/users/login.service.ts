import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LocalStorageKeys } from 'src/app/utilities/literals';
import { UsersService } from './users.service';
import { iUser } from 'src/app/models/users/iUser';
import { environment } from 'src/environments/environment';
import { Authenticate } from 'src/app/utilities/enum-http-routes';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    private authTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

    constructor(private http: HttpClient, private router: Router, private usersService: UsersService) {

        const storedToken = localStorage.getItem(LocalStorageKeys.tokenKey);
        if (storedToken) {
            this.authTokenSubject.next(storedToken);
        }
    }

    /**
     * Realiza el inicio de sesión de un usuario. Guarda en localStorage el token de autenticación
     * y los datos del usuario.
     * @param email el email del usuario.
     * @param password la contraseña del usuario.
     * @returns 
     */
    login(email: string, password: string): Observable<any> {
        const loginData = { email, password };
        return this.http.post<any>(environment.apiUrl + Authenticate.login, loginData).pipe(
            tap(response => {
                if (response && response.token) {
                    localStorage.setItem(LocalStorageKeys.tokenKey, response.token);
                    this.authTokenSubject.next(response.token);

                    const loggedUser: iUser = {
                        id: response.userId, userName: response.userName,
                        email: response.email, phoneNumber: response.phoneNumber,
                        role: response.role, language: response.languageId,
                        fullName: response.fullName
                     }

                    this.usersService.currentUser = loggedUser;
                    
                    if(response.languageId) {
                        localStorage.setItem(LocalStorageKeys.userLanguageKey, response.languageId);
                        switch(localStorage.getItem(LocalStorageKeys.userLanguageKey)) {
                            case '1':
                                localStorage.setItem(LocalStorageKeys.selectedLanguage, 'en');
                                break;
                            case '2':
                                localStorage.setItem(LocalStorageKeys.selectedLanguage, 'es');
                                break;
                            default:
                                localStorage.setItem(LocalStorageKeys.selectedLanguage, 'es');
                                break;
                        }
                    }
                }
            })
        );
    }

    /**
     * Elimina el token de autenticación y los datos del usuario de localStorage
     * para manejar el cierre de sesión.
     */
    logout(): void {
        localStorage.removeItem(LocalStorageKeys.tokenKey);
        localStorage.removeItem(LocalStorageKeys.userLanguageKey);
        this.usersService.currentUser = null;
        this.authTokenSubject.next(null);
        this.router.navigate(['/login']);
    }


    getAuthToken(): Observable<string | null> {
        return this.authTokenSubject.asObservable();
    }
}