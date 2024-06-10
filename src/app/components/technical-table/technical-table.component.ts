import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { iUser } from 'src/app/models/users/iUser';
import { iUserTable } from 'src/app/models/users/iUserTable';
import { UsersService } from 'src/app/services/users/users.service';


@Component({
  selector: 'app-technical-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, TranslateModule],
  templateUrl: './technical-table.component.html',
  styleUrls: ['./technical-table.component.scss']
})
export class TechnicalTableComponent implements OnInit, OnDestroy {
  users: iUserTable[] = [];

  usersSubscription: Subscription = Subscription.EMPTY;

  constructor(private usersService: UsersService, private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use('es');
    }
  }
  ngOnInit(): void {
    this.usersSubscription = this.usersService.getTechnicians().subscribe({
      next: (response: iUser[]) => {
        const users: iUserTable[] = response.map((value: iUserTable) => {
          return {
            id: value.id,
            fullName: value.fullName,
            email: value.email,
            phoneNumber: value.phoneNumber
          };
        });
        this.users = users;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }
}
