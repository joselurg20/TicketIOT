import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { iUserGraph } from "src/app/models/users/iUserGraph";
import { UsersService } from "./users.service";
import { iUser } from "src/app/models/users/iUser";

@Injectable({
    providedIn: 'root'
  })
  export class UserDataService {

    private usersSubject: BehaviorSubject<iUserGraph[]> = new BehaviorSubject<iUserGraph[]>([]);
    users$: Observable<iUserGraph[]> = this.usersSubject.asObservable();
    private usersFNSubject: BehaviorSubject<iUserGraph[]> = new BehaviorSubject<iUserGraph[]>([]);
    usersFN$: Observable<iUserGraph[]> = this.usersFNSubject.asObservable();
    
    constructor(private usersService: UsersService) { }

    getTechnicians() {
        this.usersService.getTechnicians().subscribe({
        next: (response: iUser[]) => {
            const users: iUserGraph[] = response.map((value: iUser) => {
            return {
                id: value.id,
                userName: value.userName,
                fullName: value.fullName
            }
            })
            const usersFN: iUserGraph[] = response.map((value: iUser) => {
            return {
                id: value.id,
                userName: value.fullName,
                fullName: value.fullName
            }
            })
            this.usersFNSubject.next(usersFN);
            this.usersSubject.next(users);
        },
        error: (error: any) => {
            console.error('Error al obtener los usuarios:', error);
        }
        });
    }

  }