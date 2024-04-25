import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { TicketFilterRequestDto } from 'src/app/models/tickets/TicketFilterRequestDto';
import { iTicketTableSM } from 'src/app/models/tickets/iTicketTableSM';
import { iUserTable } from 'src/app/models/users/iUserTable';
import { ApiService } from 'src/app/services/api.service';
import { LanguageUpdateService } from 'src/app/services/languageUpdateService';
import { LoadingService } from 'src/app/services/loading.service';
import { TicketsService } from 'src/app/services/tickets.service';
import { Priorities, Status } from 'src/app/utilities/enum';
import { LoadingComponent } from '../../shared/loading.component';

@Component({
  selector: 'app-incidence-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatNativeDateModule, MatDatepickerModule, MatInputModule, MatTableModule,
    MatPaginatorModule, MatSortModule, MatTooltipModule, MatProgressSpinnerModule, MatBadgeModule, MatButtonModule, TranslateModule, LoadingComponent],
  templateUrl: './incidence-table.component.html',
  styleUrls: ['./incidence-table.component.scss']
})
export class IncidenceTableComponent implements AfterViewInit, OnInit {

  //Formulario
  range!: FormGroup;

  //Variables referentes a la tabla
  displayedColumns: string[] = ['status', 'id', 'title', 'name', 'email', 'priority', 'timestamp', 'technician', 'show'];
  dataSource = new MatTableDataSource<iTicketTableSM>();
  selectedRow: any;

  //Nombre del usuario logueado
  loggedUserName: string = "";

  //Flags de control
  isSupportManager: boolean = false;
  loading$: Observable<boolean>;
  showFilter: boolean = false;

  //Listas de datos a representar en la tabla
  tickets: iTicketTableSM[] = [];
  users: iUserTable[] = [];

  //Subscripción para triggers de cambio de idioma
  private langUpdateSubscription: Subscription = {} as Subscription;

  //Valores seleccionados en el formulario de filtros
  selectedStatusFilter: number = -1;
  selectedPriorityFilter: number = -1;
  selectedTechnicianFilter: number = -1;
  searchString: string = '';

  //Filtro de incidencias
  filter: TicketFilterRequestDto = {
    status: -1,
    priority: -1,
    userId: -1,
    start: new Date(1900, 0, 1),
    end: new Date(3000, 0, 1),
    searchString: ''
  }

  constructor(private _liveAnnouncer: LiveAnnouncer, private apiService: ApiService,
    private router: Router, private translate: TranslateService, private cdr: ChangeDetectorRef,
    private ticketsService: TicketsService, private loadingService: LoadingService, private readonly dateAdapter: DateAdapter<Date>,
    private langUpdateService: LanguageUpdateService) {
    this.translate.addLangs(['en', 'es']);
    var lang = '';
    switch (localStorage.getItem('userLanguage')) {
      case '1':
        lang = 'en';
        break;
      case '2':
        lang = 'es';
        break;
      default:
        lang = 'es';
        break;
    }
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use(lang);
    }
    this.loading$ = this.loadingService.loading$;
  }
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;



  @ViewChild('icon')
  iconElement!: ElementRef;

  ngOnInit(): void {
    this.loadingService.showLoading();
    this.range = new FormGroup({
      start: new FormControl(),
      end: new FormControl()
    })
    switch (localStorage.getItem('selectedLanguage')) {
      case 'en':
        this.setLocale('en');
        break;
      case 'es':
        this.setLocale('es');
        break;
      default:
        this.setLocale('es');
        break;
    }
    if (localStorage.getItem('userRole') == 'SupportManager') {
      this.isSupportManager = true;
      this.apiService.getTechnicians().subscribe({
        next: (response: any) => {
          this.users = response.result.map((value: any) => {
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
      this.displayedColumns = ['status', 'id', 'title', 'name', 'email', 'priority', 'timestamp', 'technician', 'newMessages', 'show'];
      this.isSupportManager = false;
    }
    this.ticketsService.tickets$.subscribe(tickets => {
      this.dataSource.data = tickets;
      this.loadingService.hideLoading();
      this.cdr.detectChanges();
    });
    this.langUpdateService.langUpdated$.subscribe(() => {
      this.setLocale(localStorage.getItem('selectedLanguage')!);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (localStorage.getItem('userRole') == 'SupportManager') {
      this.dataSource.sort.active = 'timestamp';
      this.dataSource.sort.direction = 'desc';
    } else {
      this.dataSource.sort.active = 'newMessages';
      this.dataSource.sort.direction = 'desc';
    }
    this.dataSource.sortingDataAccessor = (data: iTicketTableSM, sortHeaderId: string) => {
      switch (sortHeaderId) {
        case 'priority':
          return data.priority;
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
    // Detectar manualmente los cambios
    this.cdr.detectChanges();
  }

  /**
   * Cambia el locale para el componente de fechas.
   * @param locale el nombre del locale a usar.
   */
  setLocale(locale: string) {
    this.dateAdapter.setLocale(locale);
  }

  /**
   * Filtra las incidencias según los valores de los campos de filtrado.
   */
  filterTickets() {
    if (this.range.value['start'] && this.range.value['end']) {
      this.filter.start = this.range.value['start'];
      this.filter.end = this.range.value['end'];
    } else {
      this.filter.start = new Date(1900, 1, 1);
      this.filter.end = new Date(3000, 1, 1);
    }
    this.filter.status = this.selectedStatusFilter;
    this.filter.priority = this.selectedPriorityFilter;
    this.filter.userId = this.selectedTechnicianFilter;
    this.filter.searchString = this.searchString;
    this.ticketsService.filterTickets(this.filter);

    this.showFilter = false;
    this.searchString = '';
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
    this.goToTickets();
  }

  /**
   * Redirige a la vista correspondiente al ticket seleccionado y según el rol del usuario.
   */
  goToTickets() {
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
  getButtonPriority(priority: Priorities): any {
    let buttonStyles = {};

    if (priority == 5) {
      buttonStyles = { 'background-color': '#c82337' };
    } else if (priority == 4) {
      buttonStyles = { 'background-color': '#e06236' };
    } else if (priority == 3) {
      buttonStyles = { 'background-color': '#fdb83f' };
    } else if (priority == 2) {
      buttonStyles = { 'background-color': '#3beb97' };
    } else if (priority == 1) {
      buttonStyles = { 'background-color': '#3bd6eb' };
    } else {
      buttonStyles = { 'background-color': '#7B7B7B' };
    }
    return buttonStyles;


  }

  /**
   * Da color a los cuadros de estado.
   * @param status el estado.
   * @returns la línea de css correspondiente al estado.
   */
  getButtonState(status: Status): any {
    let buttonStyles = {};

    if (status == 3) {
      buttonStyles = { 'background-color': '#c82337' };
    } else if (status == 2) {
      buttonStyles = { 'background-color': '#e06236' };
    } else if (status == 1) {
      buttonStyles = { 'background-color': '#3beb97' };
    } else {
      buttonStyles = { 'background-color': '#7B7B7B' };
    }
    return buttonStyles;


  }

  /**
   * Muestra u oculta el formulario de filtrado.
   */
  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

}