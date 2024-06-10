import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { iUser } from 'src/app/models/users/iUser';
import { iUserGraph } from 'src/app/models/users/iUserGraph';
import { LanguageUpdateService } from 'src/app/services/languageUpdateService';
import { LoadingService } from 'src/app/services/loading.service';
import { TicketDataService } from 'src/app/services/tickets/ticketData.service';
import { UsersService } from 'src/app/services/users/users.service';
import { Priorities, Status } from 'src/app/utilities/enum';
import { LocalStorageKeys, Roles } from 'src/app/utilities/literals';
import { Routes } from 'src/app/utilities/routes';
import { Utils } from 'src/app/utilities/utils';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { ComponentLoadService } from 'src/app/services/componentLoad.service';

@Component({
  selector: 'app-incidence-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatNativeDateModule, MatDatepickerModule, MatInputModule, MatTableModule,
    MatPaginatorModule, MatSortModule, MatTooltipModule, MatProgressSpinnerModule, MatBadgeModule, MatButtonModule, TranslateModule, LoadingComponent],
  templateUrl: './incidence-table.component.html',
  styleUrls: ['./incidence-table.component.scss']
})
export class IncidenceTableComponent implements AfterViewInit, OnInit, OnDestroy {

  //Formulario
  range!: FormGroup;

  //Variables referentes a la tabla
  displayedColumns: string[] = ['status', 'id', 'title', 'name', 'email', 'priority', 'timestamp', 'technician', 'show'];
  dataSource = new MatTableDataSource<iTicketTableSM>();
  selectedRow: any;

  //Flags de control
  isSupportManager: boolean = false;
  loading$: Observable<boolean>;
  showFilter: boolean = false;
  isFirstLoad: boolean = true;

  //Listas de datos a representar en la tabla
  tickets: iTicketTableSM[] = [];
  users: iUserGraph[] = [];

  //Subscripciones
  private langUpdateSubscription: Subscription = Subscription.EMPTY;
  componentLoadSubscription: Subscription = Subscription.EMPTY;
  usersSubscription: Subscription = Subscription.EMPTY;
  ticketsSubscription: Subscription = Subscription.EMPTY;
  

  //Valores seleccionados en el formulario de filtros
  selectedStatusFilter: number = -1;
  selectedPriorityFilter: number = -1;
  selectedTechnicianFilter: number = -1;
  searchString: string = '';

  //Prioridades y Estados a mostrar en selectores
  priorities: Priorities[] = Object.values(Priorities).filter(value => typeof value === 'number') as Priorities[];
  status: Status[] = Object.values(Status).filter(value => typeof value === 'number') as Status[];

  //Filtro de incidencias
  filter: TicketFilterRequestDto = {
    status: -1,
    priority: -1,
    userId: -1,
    start: new Date(1900, 0, 1),
    end: new Date(3000, 0, 1),
    searchString: ''
  }

  constructor(private _liveAnnouncer: LiveAnnouncer, private usersService: UsersService,
    private router: Router, private translate: TranslateService, private cdr: ChangeDetectorRef,
    private ticketDataService: TicketDataService, private loadingService: LoadingService,
    private readonly dateAdapter: DateAdapter<Date>, private langUpdateService: LanguageUpdateService,
    private componentLoadService: ComponentLoadService) {
    this.translate.addLangs(['en', 'es']);
    var lang = '';
    switch (localStorage.getItem(LocalStorageKeys.userLanguageKey)) {
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
    this.componentLoadSubscription = this.componentLoadService.loadComponent$.subscribe(() => {
      this.range = new FormGroup({
        start: new FormControl(),
        end: new FormControl()
      })
      switch (localStorage.getItem(LocalStorageKeys.selectedLanguage)) {
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
      if (this.usersService.currentUser?.role === Roles.managerRole) {
        this.isSupportManager = true;
        this.usersSubscription = this.usersService.getTechnicians().subscribe({
          next: (response: iUser[]) => {
            this.users = response.map((value: iUser) => {
              return {
                id: value.id,
                userName: value.userName,
                fullName: value.fullName
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
      if (!localStorage.getItem(LocalStorageKeys.reloaded)) {
        localStorage.setItem(LocalStorageKeys.reloaded, 'true');
        window.location.reload();
      }

    });
    this.ticketsSubscription = this.ticketDataService.tickets$.subscribe(tickets => {
      this.dataSource.data = tickets;
      this.loadingService.hideLoading();
      this.cdr.detectChanges();
    });
    this.langUpdateSubscription = this.langUpdateService.langUpdated$.subscribe(() => {
      this.setLocale(localStorage.getItem(LocalStorageKeys.selectedLanguage)!);
      this.ticketDataService.getTickets(this.isSupportManager);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (this.usersService.currentUser?.role === Roles.managerRole) {
        this.dataSource.sort.active = 'id';
        this.dataSource.sort.direction = 'asc';
      } else {
        this.dataSource.sort.active = 'newMessages';
        this.dataSource.sort.direction = 'desc';
      }
      this.dataSource.sortingDataAccessor = (data: iTicketTableSM, sortHeaderId: string) => {
        switch (sortHeaderId) {
          case 'newMessages':
            return this.getHasNewMessagesValue(data.hasNewMessages);
          case 'priority':
            return data.priority;
          case 'timestamp':
            return data.timestamp;
          case 'technician':
            return data.techName;
          default:
            const value = data[sortHeaderId as keyof iTicketTableSM];
            return typeof value === 'string' ? value.toLowerCase() : (typeof value === 'number' ? value : 0);
        }
      };
      // Detectar manualmente los cambios
      this.cdr.detectChanges();
    }, 0)
    if (this.usersService.currentUser?.role === Roles.technicianRole && this.isFirstLoad) {
      this.isFirstLoad = false;
      this.ngAfterViewInit();
    }
  }

  ngOnDestroy() {
    this.componentLoadSubscription.unsubscribe();
    this.ticketsSubscription.unsubscribe();
    this.langUpdateSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
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
      this.filter.end.setDate(this.filter.end.getDate() + 1);
    } else {
      this.filter.start = new Date(1900, 1, 1);
      this.filter.end = new Date(3000, 1, 1);
    }
    this.filter.status = this.selectedStatusFilter;
    this.filter.priority = this.selectedPriorityFilter;
    if(this.isSupportManager) {
      this.filter.userId = this.selectedTechnicianFilter;
    } else {
      this.filter.userId = this.usersService.currentUser?.id!;
    }
    this.filter.searchString = this.searchString;
    this.ticketDataService.filterTickets(this.filter);

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
    localStorage.setItem(LocalStorageKeys.selectedTicket, this.selectedRow.id);
    this.goToTickets();
  }

  /**
   * Redirige a la vista correspondiente al ticket seleccionado y según el rol del usuario.
   */
  goToTickets() {
    if (localStorage.getItem(LocalStorageKeys.selectedTicket) != null) {
        this.router.navigate([Routes.reviewManager]);
    }

  }

  /**
   * Redirige a la vista correspondiente a la creación de nuevo ticket.
   */
  goToNewTicket() {
    this.router.navigate([Routes.incidence]);
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

  /**
   * Obtiene el texto a representar en función de la prioridad y el idioma.
   * @param priority la prioridad.
   * @returns la cadena de texto a representar.
   */
  getPriorityString(priority: number): string {
    return Utils.getPriorityString(priority);
  }

  /**
   * Obtiene el texto a representar en función del estado y el idioma.
   * @param status el estado.
   * @returns la cadena de texto a representar.
   */
  getStatusString(status: number): string {
    return Utils.getStatusString(status);
  }

}