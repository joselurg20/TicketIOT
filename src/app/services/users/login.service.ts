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
import { Routes } from 'src/app/utilities/routes';

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
     * Comprueba si el usuario esta logeado.
     * @returns 
     */
    isLogged(): boolean {
        console.log('1', localStorage.getItem(LocalStorageKeys.tokenKey) !== null);
        if(localStorage.getItem(LocalStorageKeys.tokenKey)) {
            console.log('2', localStorage.getItem(LocalStorageKeys.loggedUser) !== null);
            if(localStorage.getItem(LocalStorageKeys.loggedUser)) {
                console.log('3', !this.usersService.currentUser?.id);
                if(!this.usersService.currentUser?.id){
                    this.usersService.getUserById(parseInt(localStorage.getItem(LocalStorageKeys.loggedUser)!)).subscribe({
                        next: (user) => {
                            console.log('4', user);
                            this.usersService.currentUser = user;
                            console.log('5', this.usersService.currentUser);
                        },
                        error: (error) => {
                            console.log('error', error);
                        }
                    });
                }
            }
            return true;
        }
        return false;
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
                    console.log('loggedUser', this.usersService.currentUser);

                    if(response.userId) {
                        localStorage.setItem(LocalStorageKeys.loggedUser, response.userId);
                    }
                    
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
        localStorage.removeItem(LocalStorageKeys.loggedUser);
        if(localStorage.getItem(LocalStorageKeys.selectedTicket)) {
            localStorage.removeItem(LocalStorageKeys.selectedTicket);
        }
        this.usersService.currentUser = null;
        this.authTokenSubject.next(null);
        this.router.navigate([Routes.login]);
    }


    getAuthToken(): Observable<string | null> {
        return this.authTokenSubject.asObservable();
    }
}