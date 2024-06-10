import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Observable, Subscription } from 'rxjs';
import { iTicketGraph } from 'src/app/models/tickets/iTicketsGraph';
import { LanguageUpdateService } from 'src/app/services/languageUpdateService';
import { TicketDataService } from 'src/app/services/tickets/ticketData.service';
import { LoadingComponent } from "../../shared/loading/loading.component";
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageKeys , Roles } from 'src/app/utilities/literals';
import { iUser } from 'src/app/models/users/iUser';
import { iUserGraph } from 'src/app/models/users/iUserGraph';
import { UserDataService } from 'src/app/services/users/userData.service';
import { ComponentLoadService } from 'src/app/services/componentLoad.service';
import { Router } from '@angular/router';
import { Routes } from 'src/app/utilities/routes';

@Component({
  selector: 'app-chart-bar',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.scss']
})
export class ChartBarComponent implements OnInit, OnDestroy {

  

  users: iUserGraph[] = [];
  tickets: iTicketGraph[] = [];
  myChart: any;
  titleEs: string = 'Incidencias por técnico';
  titleEn: string = 'Tickets by technician';
  title: string = this.titleEs;
  private langUpdateSubscription: Subscription = Subscription.EMPTY;
  loading$: Observable<boolean>;
  isFirstLoad: boolean = true;

  componentLoadSubscription: Subscription = Subscription.EMPTY;
  usersSubscription: Subscription = Subscription.EMPTY;
  usersGraphSubscription: Subscription = Subscription.EMPTY;

  constructor(private ticketsService: TicketDataService, private langUpdateService: LanguageUpdateService,
              private loadingService: LoadingService, private userDataService: UserDataService,
              private componentLoadService: ComponentLoadService, private router: Router) {
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit() {
    this.componentLoadSubscription = this.componentLoadService.loadComponent$.subscribe(() => {
        
      if(this.router.url == '/' + Routes.supportManager) {
    
        if(localStorage.getItem(LocalStorageKeys.selectedLanguage) == 'en'){
          this.title = this.titleEn;
        }else if(localStorage.getItem(LocalStorageKeys.selectedLanguage) == 'es'){
          this.title = this.titleEs;
        }  
          this.usersSubscription = this.userDataService.usersFN$.subscribe(users => {
            this.users = users;
            if(!this.isFirstLoad && this.router.url == '/' + Routes.supportManager){
              this.createChart();
              this.loadingService.hideLoading();
            }
            this.isFirstLoad = false
          });
          this.usersGraphSubscription =this.ticketsService.usersGraph$.subscribe(usersGraph => {
            this.tickets = usersGraph;
            if(!this.isFirstLoad && this.router.url == '/' + Routes.supportManager){
              this.createChart();
              this.loadingService.hideLoading();
            }
            this.isFirstLoad = false
          });
          this.langUpdateSubscription = this.langUpdateService.langUpdated$.subscribe(() => {
            this.switchLanguage();
          });
      }
    });
  }

  ngOnDestroy() {
    this.componentLoadSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
    this.usersGraphSubscription.unsubscribe();
    this.langUpdateSubscription.unsubscribe();
  }

  /**
   * Cambia el idioma del gráfico
   */
  switchLanguage() {
    if(localStorage.getItem(LocalStorageKeys.selectedLanguage) == 'en'){
      this.title = this.titleEn;
    }else if(localStorage.getItem(LocalStorageKeys.selectedLanguage) == 'es'){
      this.title = this.titleEs;
    }
    this.createChart();

    
  }

  ngAfterViewInit(): void {
    this.loadingService.showLoading();
    this.createChart();
    this.loadingService.hideLoading();
  }

  /**
   * 
   * @returns Crea el gráfico.
   */
  createChart(): void {
    var chartExist = Chart.getChart("myChart");
    if(chartExist != undefined)
      chartExist.destroy();
    if(this.myChart)
      this.myChart.destroy();

    const technicianNames = this.users.map(user => user.userName); // Obtener nombres de los técnicos
    const technicianIds = this.users.map(user => user.id);
    const incidentCounts = technicianIds.map(id => {
      // Calcular el número de incidentes para cada técnico
      return this.tickets.filter(ticket => ticket.userId === id).length;
    });


    

    Chart.register(...registerables);

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Error: Canvas element not found');
      return;
    }
    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: technicianNames,
        datasets: [{
          label: '',
          data: incidentCounts,
          backgroundColor: [
            'rgba(232, 19, 87, 1)',
            'rgba(116, 92, 216, 1)',
            'rgba(253, 183, 63, 1)',
            'rgba(59, 235, 151, 1)',
            'rgba(59, 214, 235, 1)',
            'rgba(255, 255, 255, 1)',
            '#c82337',
            '#e06236',
            '#fdb83f',
            'rgba(59, 235, 151, 1)',
            'rgba(59, 214, 235, 1)',
            'grey'
          ],
          borderColor: [
            'black',
            'black',
            'black',
            'black',
            'black',
            'black',
            'black',
            'black',
            'black',
            'black',
            'black',
            'black'
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: this.title,
            color: '#EFB810',
            font: {
              size: 20
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'white'
            },
            grid: {
              color: 'white'
            }
          },
          x: {
            ticks: {
              color: 'white'
            },
            grid: {
              color: 'white'
            }
          }
        }
      }
    });
  }
}
