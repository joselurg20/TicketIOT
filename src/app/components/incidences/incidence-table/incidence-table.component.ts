import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TicketFilterRequestDto } from 'src/app/models/tickets/TicketFilterRequestDto';
import { iTicketTableSM } from 'src/app/models/tickets/iTicketTableSM';
import { iUserTable } from 'src/app/models/users/iUserTable';
import { ApiService } from 'src/app/services/api.service';
import { GraphUpdateService } from 'src/app/services/graphUpdateService';

@Component({
  selector: 'app-incidence-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule,
    MatTooltipModule, MatBadgeModule, MatProgressSpinnerModule, TranslateModule, FormsModule,
    ReactiveFormsModule, MatInputModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './incidence-table.component.html',
  styleUrls: ['./incidence-table.component.scss']
})
export class IncidenceTableComponent implements AfterViewInit, OnInit {

  //Formulario
  range!: FormGroup;

  //Variables referentes a la tabla
  displayedColumns: string[] = ['state', 'id', 'title', 'name', 'email', 'priority', 'timestamp', 'technician', 'show'];
  dataSource = new MatTableDataSource<iTicketTableSM>();
  selectedRow: any;

  //Nombre del usuario logueado
  loggedUserName: string = "";

  //Flags de control
  isIconChanged: boolean = false;
  isShowingAll: boolean = false;
  isSupportManager: boolean = false;
  isbadgeHidden: boolean = true;
  isLoading: boolean = false;
  showFilter: boolean = false;

  //Lista de usuarios a representar en la tabla
  users: iUserTable[] = [];

  //Valores seleccionados en el formulario de filtros
  selectedStateFilter: number = -1;
  selectedPriorityFilter: number = -1;
  selectedTechnicianFilter: number = -1;

  //Filtro de incidencias
  filter: TicketFilterRequestDto = {
    state: -1,
    priority: -1,
    userId: -1,
    start: new Date(1900, 0, 1),
    end: new Date(3000, 0, 1)
  }

  constructor(private _liveAnnouncer: LiveAnnouncer, private apiService: ApiService,
              private router: Router, private graphUpdateService: GraphUpdateService,
              private translate: TranslateService) {
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

  ngOnInit(): void {
    this.range = new FormGroup({
      start: new FormControl(),
      end: new FormControl()
    })
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
          
        },
        error: (error: any) => {
          console.error('Error al obtener los tickets del usuario:', error);
        }
      });
      this.apiService.getTechnicians().subscribe({
        next: (response: any) => {
          console.log('Users recibidos', response);
          this.users = response.map((value: any) => {
            return {
              id: value.id,
              userName: value.fullName
            };
          });
        },
        error: (error: any) => {
          console.error('Error al obtener los tickets del usuario:', error);
        }
      });
        
    } else {
      this.displayedColumns = ['state', 'id', 'title', 'name', 'email', 'priority', 'timestamp', 'technician', 'newMessages', 'show'];
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
          for (let ticket of tickets) {
            if (ticket.state == 'FINISHED') {
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (localStorage.getItem('userRole') == 'SupportManager') {
      this.dataSource.sort.active = 'priority';
      this.dataSource.sort.direction = 'desc';
    } else {
      this.dataSource.sort.active = 'newMessages';
      this.dataSource.sort.direction = 'desc';
    }
    this.dataSource.sortingDataAccessor = (data: iTicketTableSM, sortHeaderId: string) => {
      switch (sortHeaderId) {
        case 'priority':
          return this.getPriorityValue(data.priority);
        case 'timestamp':
          return data.timestamp;
        case 'technician':
          return data.techName;
        case 'newMessages':
          return this.getHasNewMessagesValue(data.hasNewMessages);
        default:
          const value = data[sortHeaderId as keyof iTicketTableSM];
          return typeof value === 'string' ? value.toLowerCase() : (typeof value === 'number' ? value : 0);
      }
    };
  }

  /**
   * Filtra las incidencias según los valores de los campos de filtrado.
   */
  filterTickets() {
    if (this.range.value['start'] && this.range.value['end']) {
      this.filter.start = this.range.value['start'];
      this.filter.end = this.range.value['end'];
    }else {
      this.filter.start = new Date(1900, 1, 1);
      this.filter.end = new Date(3000, 1, 1);
    }
    this.filter.state = this.selectedStateFilter;
    this.filter.priority = this.selectedPriorityFilter;
    this.filter.userId = this.selectedTechnicianFilter;
    this.apiService.filterTickets(this.filter).subscribe({
      next: (response: any) => {
        console.log('Tickets filtrados', response);
        const tickets: iTicketTableSM[] = response.tickets.$values.map((value: any) => {
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
        console.error('Error al obtener los tickets filtrados:', error);
      }
    })
    this.showFilter = false;
  }

  /**
   * Cambia la visibilidad del badge.
   */
  toggleBadgeVisibility() {
    this.isbadgeHidden = !this.isbadgeHidden;
  }

  /**
   * Cambia el tipo de orden de la tabla.
   * @param sortState el nuevo tipo de ordenado.
   */
  announceSortChange(sortState: Sort) {

    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  /**
   * Resalta una fila de la tabla.
   * @param event el evento del ratón.
   */
  highlightRow(event: MouseEvent) {
    const row = event.currentTarget as HTMLTableRowElement;
    row.classList.add('highlighted');
  }

  /**
   * Deja de resaltar una fila de la tabla.
   * @param event el evento del ratón.
   */
  unhighlightRow(event: MouseEvent) {
    const row = event.currentTarget as HTMLTableRowElement;
    row.classList.remove('highlighted');
  }

  /**
   * Traduce un valor de prioridad a un valor numérico.
   * @param priority el valor de la prioridad.
   * @returns el valor numérico de la prioridad.
   */
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

  /**
   * Traduce un valor de newMessages a un valor numérico.
   * @param hasNewMessages el valor de newMessages.
   * @returns el valor numérico de newMessages.
   */
  getHasNewMessagesValue(hasNewMessages: boolean): number {
    if (hasNewMessages) {
      return 1;
    } else {
      return 0;
    }

  }

  /**
   * Guarda en localstorage el id del ticket que corresponde a la fila seleccionada.
   * @param row la fila seleccionada.
   */
  onRowClicked(row: any) {
    this.selectedRow = row;
    localStorage.setItem('selectedTicket', this.selectedRow.id);
    this.tickets();
  }

  /**
   * Redirige a la vista correspondiente al ticket seleccionado y según el rol del usuario.
   */
  tickets() {
    if (localStorage.getItem('userRole') == 'SupportManager') {
      if (localStorage.getItem('selectedTicket') != null) {
        this.router.navigate(['/revisar-manager']);
      }
    } else {
      if (localStorage.getItem('selectedTicket') != null) {
        this.router.navigate(['/revisar-tecnico']);
      }
    }

  }

  /**
   * Da color a los cuadros de prioridad según esta.
   * @param priority la prioridad.
   * @returns la línea de css correspondiente a la prioridad.
   */
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
    } else {
      buttonStyles = { 'background-color': '#7B7B7B' };
    }
    return buttonStyles;


  }

  /**
   * Da color a los cuadros de estado.
   * @param state el estado.
   * @returns la línea de css correspondiente al estado.
   */
  getButtonState(state: string): any {
    let buttonStyles = {};

    if (state == 'FINISHED') {
      buttonStyles = { 'background-color': '#c82337' };
    } else if (state == 'PAUSED') {
      buttonStyles = { 'background-color': '#e06236' };
    } else if (state == 'OPENED') {
      buttonStyles = { 'background-color': '#3beb97' };
    } else {
      buttonStyles = { 'background-color': '#7B7B7B' };
    }
    return buttonStyles;


  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }


  /**
   * Da formato a la fecha.
   * @param fecha la fecha a formatear.
   * @returns la fecha con formato 'DD/MM/AAAA - HH:mm:ss'
   */
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