import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserJsonResult } from 'src/app/models/JsonResult';
import { iUserTable } from 'src/app/models/users/iUserTable';
import { UsersService } from 'src/app/services/users/users.service';


@Component({
  selector: 'app-technical-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, TranslateModule],
  templateUrl: './technical-table.component.html',
  styleUrls: ['./technical-table.component.scss']
})
export class TechnicalTableComponent implements OnInit {
  users: iUserTable[] = [];

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
    this.usersService.getTechnicians().subscribe({
      next: (response: UserJsonResult) => {
        const users: iUserTable[] = response.result.map((value: iUserTable) => {
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
}
