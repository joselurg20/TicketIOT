import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { iTicketTableSM } from 'src/app/models/tickets/iTicketTableSM';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatBadgeModule} from '@angular/material/badge';
import { iUserTable } from 'src/app/models/users/iUserTable';
import { GraphUpdateService } from 'src/app/services/graphUpdateService';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-incidence-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule,
    MatTooltipModule, MatBadgeModule, MatProgressSpinnerModule, TranslateModule],
  templateUrl: './incidence-table.component.html',
  styleUrls: ['./incidence-table.component.scss']
})
export class IncidenceTableComponent implements AfterViewInit, OnInit {


  displayedColumns: string[] = ['id', 'title', 'name', 'email', 'priority', 'state', 'timestamp', 'technician', 'show'];
  dataSource = new MatTableDataSource<iTicketTableSM>();
  selectedRow: any;
  loggedUserName: string = "";
  isIconChanged: boolean = false;
  isShowingAll: boolean = false;
  isSupportManager: boolean = false;
  isbadgeHidden: boolean = true;
  isLoading: boolean = false;

  constructor(private _liveAnnouncer: LiveAnnouncer, private apiService: ApiService, private router: Router, private graphUpdateService: GraphUpdateService, private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use('es');
      
    }
  }
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;



  @ViewChild('icon')
  iconElement!: ElementRef;

  toggleBadgeVisibility() {
    this.isbadgeHidden = !this.isbadgeHidden;
  }

  cambiarIcono() {
    // Cambiar la clase del icono al icono deseado
    if (this.isIconChanged) {
      this.iconElement.nativeElement.className = 'fa-solid fa-eye';
    } else {
      this.iconElement.nativeElement.className = 'fa-solid fa-eye-slash';
    }
    this.isIconChanged = !this.isIconChanged; 
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if(localStorage.getItem('userRole') == 'SupportManager') {
      this.dataSource.sort.active = 'priority';
      this.dataSource.sort.direction = 'desc';
    }else{
      this.dataSource.sort.active = 'newMessages';
      this.dataSource.sort.direction = 'desc';
    }
    this.dataSource.sortingDataAccessor = (data: iTicketTableSM, sortHeaderId: string) => {
      switch (sortHeaderId) {
        case 'priority':
          return this.getPriorityValue(data.priority);
        case 'timestamp':
          return new Date(data.timestamp).getTime(); // Convertir la fecha a milisegundos para ordenar correctamente
        case 'newMessages':
          return this.getHasNewMessagesValue(data.hasNewMessages);
        default:
          const value = data[sortHeaderId as keyof iTicketTableSM]; // Obtener el valor de la propiedad
          return typeof value === 'string' ? value.toLowerCase() : (typeof value === 'number' ? value : 0); // Convertir a minúsculas si es una cadena o devolver el valor numérico
      }
    };
  }
  announceSortChange(sortState: Sort) {

    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  highlightRow(event: MouseEvent) {
    const row = event.currentTarget as HTMLTableRowElement;
    row.classList.add('highlighted');
  }

  unhighlightRow(event: MouseEvent) {
    const row = event.currentTarget as HTMLTableRowElement;
    row.classList.remove('highlighted');
  }

  getPriorityValue(priority: string): number {
    switch (priority) {
      case 'HIGHEST': return 5;
      case 'HIGH': return 4;
      case 'MEDIUM': return 3;
      case 'LOW': return 2;
      case 'LOWEST': return 1;
      default: return 0;
    }
  }

  getHasNewMessagesValue(hasNewMessages: boolean): number {
    if (hasNewMessages) {
      return 1;
    } else {
      return 0;
    }

  }

  onRowClicked(row: any) {
    this.selectedRow = row;
    localStorage.setItem('selectedTicket', this.selectedRow.id);
    this.tickets();
  }

  tickets() {
    if(localStorage.getItem('userRole') == 'SupportManager') {
      if (localStorage.getItem('selectedTicket') != null) {
        this.router.navigate(['/revisar-manager']);
      }
    } else {
      if (localStorage.getItem('selectedTicket') != null) {
        this.router.navigate(['/revisar-tecnico']);
      }
    }
    
  }

  showAll() {
    this.graphUpdateService.triggerGraphUpdate();
    if(!this.isShowingAll) {
      this.apiService.getTickets().subscribe({
        next: (response: any) => {
          console.log('Tickets recibidos', response);
          const tickets: iTicketTableSM[] = response.$values.map((value: any) => {
            return {
              id: value.id,
              title: value.title,
              name: value.name,
              email: value.email,
              timestamp: this.formatDate(value.timestamp),
              priority: value.priority,
              state: value.state,
              techId: value.userId,
              techName: ''
            };
          });
          this.apiService.getUsers().subscribe({
            next: (response: any) => {
              console.log('Users recibidos', response);
              const users: iUserTable[] = response.map((value: any) => {
                return {
                  id: value.id,
                  userName: value.fullName
                };
              });
              tickets.forEach((ticket) => {
                const user = users.find((user) => user.id === ticket.techId);
                if (user) {
                    ticket.techName = user.userName;             
                } else {
                  ticket.techName = 'Sin asignar'
                } 
              });
              this.dataSource.data = tickets;
              console.log('Datos mapeados para tabla', tickets);
            },
            error: (error: any) => {
              console.error('Error al obtener los tickets del usuario:', error);
            }
          })
          this.dataSource.data = tickets;
          console.log('Datos mapeados para tabla', tickets);
        },
        error: (error: any) => {
          console.error('Error al obtener los tickets del usuario:', error);
        }
      });
    } else {
      this.apiService.getTicketsByUser(-1).subscribe({
        next: (response: any) => {
          console.log('Tickets recibidos', response);
          const tickets: iTicketTableSM[] = response.$values.map((value: any) => {
            return {
              id: value.id,
              title: value.title,
              name: value.name,
              email: value.email,
              timestamp: this.formatDate(value.timestamp),
              priority: value.priority,
              state: value.state,
              techName: 'Sin asignar'
            };
          });
          this.dataSource.data = tickets;
          console.log('Datos mapeados para tabla', tickets);
        },
        error: (error: any) => {
          console.error('Error al obtener los tickets del usuario:', error);
        }
      });
    }
    this.isLoading = true;
    this.isShowingAll = !this.isShowingAll;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  ngOnInit(): void {

    const userNameFromLocalStorage = localStorage.getItem('userName');
    if (!userNameFromLocalStorage) {
      console.log('No se encontró ningún nombre de usuario en el localStorage.');
    }
    if (localStorage.getItem('userRole') == 'SupportManager') {
      this.isSupportManager = true;
      this.apiService.getTicketsByUser(-1).subscribe({
        next: (response: any) => {
          console.log('Tickets recibidos', response);
          const tickets: iTicketTableSM[] = response.$values.map((value: any) => {
            return {
              id: value.id,
              title: value.title,
              name: value.name,
              email: value.email,
              timestamp: this.formatDate(value.timestamp),
              priority: value.priority,
              state: value.state,
              techName: 'Sin asignar'
            };
          });
          this.dataSource.data = tickets;
          console.log('Datos mapeados para tabla', tickets);
        },
        error: (error: any) => {
          console.error('Error al obtener los tickets del usuario:', error);
        }
      });
    } else {
      this.displayedColumns = ['id', 'title', 'name', 'email', 'priority', 'state', 'timestamp', 'technician', 'newMessages', 'show'];
      this.isSupportManager = false;
      this.apiService.getTicketsByUser(parseInt(localStorage.getItem('userId')!)).subscribe({
        next: (response: any) => {
          console.log('Tickets recibidos', response);
          // Mapear la respuesta de la API utilizando la interfaz iTicketTable
          const tickets: iTicketTableSM[] = response.$values.map((value: any) => {
            return {
              id: value.id,
              title: value.title,
              name: value.name,
              email: value.email,
              timestamp: this.formatDate(value.timestamp),
              priority: value.priority,
              state: value.state,
              hasNewMessages: value.hasNewMessages,
              newMessagesCount: value.newMessagesCount
            };
          });
          this.apiService.getUserById(parseInt(localStorage.getItem('userId')!)).subscribe({
            next: (response: any) => {
              tickets.forEach((ticket: iTicketTableSM) => {
                ticket.techName = response.fullName;
              });
            },
            error: (error: any) => {
              console.error('Error al obtener el usuario:', error);
            }
          })
          for(let ticket of tickets){
            if(ticket.state == 'FINISHED') {
              tickets.splice(tickets.indexOf(ticket), 1);
            }
          }
          this.dataSource.data = tickets; // Establecer los datos en la dataSource
          console.log('Datos mapeados para tabla', tickets);
        },
        error: (error: any) => {
          console.error('Error al obtener los tickets del usuario:', error);
        }
      });
    }
  }
  getButtonPriority(priority: string): any {
    let buttonStyles = {};

    if (priority == 'HIGHEST') {
      buttonStyles = { 'background-color': '#c82337' };
    } else if (priority == 'HIGH') {
      buttonStyles = { 'background-color': '#e06236' };
    } else if (priority == 'MEDIUM') {
      buttonStyles = { 'background-color': '#fdb83f' };
    } else if (priority == 'LOW') {
      buttonStyles = { 'background-color': '#3beb97' };
    } else if (priority == 'LOWEST') {
      buttonStyles = { 'background-color': '#3bd6eb' };
    }else{
      buttonStyles = { 'background-color': '#7B7B7B' };
    }
    return buttonStyles;
    
    
  }

    getButtonState(state: string): any {
      let buttonStyles = {};

      if (state == 'FINISHED') {
        buttonStyles = { 'background-color': '#c82337' };
      } else if (state == 'PAUSED') {
        buttonStyles = { 'background-color': '#e06236' };
      } else if (state == 'OPENED') {
        buttonStyles = { 'background-color': '#3beb97' };
      }else{
        buttonStyles = { 'background-color': '#7B7B7B' };
      }
      return buttonStyles;
      
      
    }
      


  formatDate(fecha: string): string {
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0'); // Se suma 1 porque los meses van de 0 a 11
    const año = fechaObj.getFullYear();
    const horas = fechaObj.getHours().toString().padStart(2, '0');
    const minutos = fechaObj.getMinutes().toString().padStart(2, '0');
    const segundos = fechaObj.getSeconds().toString().padStart(2, '0');

    return `${dia}/${mes}/${año} - ${horas}:${minutos}:${segundos}`;
  }

}