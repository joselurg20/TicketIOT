import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private readonly apiUrl = 'https://localhost:7131/gateway/users/authenticate';
    private readonly tokenKey = 'authToken';
    private readonly userIdKey = 'userId';
    private readonly userNameKey = 'userName';
    private readonly userEmailKey = 'userEmail';
    private readonly roleKey = 'userRole';
    private readonly userTicketIdsKey = 'userTicketIds';

    private authTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    private userIdSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
    private userNameSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    private emailSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    private roleSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    private ticketIdsSubject: BehaviorSubject<number[] | null> = new BehaviorSubject<number[] | null>(null);

    constructor(private http: HttpClient) {

        const storedToken = localStorage.getItem(this.tokenKey);
        if (storedToken) {
            this.authTokenSubject.next(storedToken);
        }
    }


    login(email: string, password: string): Observable<any> {
        const loginData = { email, password };
        return this.http.post<any>(this.apiUrl, loginData).pipe(
            tap(response => {
                if (response && response.token) {
                    // Almacenar el token de autenticación en localStorage
                    localStorage.setItem(this.tokenKey, response.token);
                    // Actualizar el BehaviorSubject con el nuevo token
                    this.authTokenSubject.next(response.token);
                    // Almacenar otros datos del usuario si son devueltos por el backend
                    if (response.userId) {
                        localStorage.setItem(this.userIdKey, response.userId);
                        this.userIdSubject.next(response.userId);
                    }
                    if (response.userName) {
                        localStorage.setItem(this.userNameKey, response.userName);
                        this.userNameSubject.next(response.userName);
                    }
                    if (response.email) {
                        localStorage.setItem(this.userEmailKey, response.email);
                        this.emailSubject.next(response.email);
                    }
                    if (response.role) {
                        localStorage.setItem(this.roleKey, response.role);
                        this.roleSubject.next(response.role);
                    }
                    if (response.ticketIds) {
                        try {
                            const ticketIds = JSON.parse(response.ticketIds);
                            localStorage.setItem(this.userTicketIdsKey, response.ticketIds);
                            this.ticketIdsSubject.next(ticketIds);
                        } catch (error) {
                            console.error('Error parsing ticketIds:', error);
                        }
                    }
                }
            })
        );
    }


    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userIdKey);
        localStorage.removeItem(this.userNameKey);
        localStorage.removeItem(this.userEmailKey);
        localStorage.removeItem(this.roleKey);
        localStorage.removeItem(this.userTicketIdsKey);
        this.authTokenSubject.next(null);
        this.userIdSubject.next(null);
        this.userNameSubject.next(null);
        this.emailSubject.next(null);
        this.roleSubject.next(null);
        this.ticketIdsSubject.next(null);
    }


    getAuthToken(): Observable<string | null> {
        return this.authTokenSubject.asObservable();
    }

    getUserId(): Observable<number | null> {
        return this.userIdSubject.asObservable();
    }

    getUserName(): Observable<string | null> {
        return this.userNameSubject.asObservable();
    }

    getUserEmail(): Observable<string | null> {
        return this.emailSubject.asObservable();
    }

    getUserRole(): Observable<string | null> {
        return this.roleSubject.asObservable();
    }

    getUserTicketIds(): Observable<number[] | null> {
        return this.ticketIdsSubject.asObservable();
    }
}