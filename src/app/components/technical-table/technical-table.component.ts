import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { iUserTable } from 'src/app/models/users/iUserTable';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-technical-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './technical-table.component.html',
  styleUrls: ['./technical-table.component.scss']
})
export class TechnicalTableComponent implements OnInit {
  users: iUserTable[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getUsers().subscribe({
      next: (response: any) => {
        console.log('Users recibidos', response);
        const users: iUserTable[] = response.map((value: any) => {
          return {
            id: value.id,
            userName: value.userName,
            email: value.email,
            phoneNumber: value.phoneNumber
          };
        });
        this.users = users;
        console.log('Datos mapeados para tabla', users);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
