import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ApiService } from 'src/app/services/api.service';
import { iTicketGraph } from 'src/app/models/tickets/iTicketsGraph';
import { iUserGraph } from 'src/app/models/users/iUserGraph';
import { LanguageUpdateService } from 'src/app/services/languageUpdateService';
import { Observable, Subscription } from 'rxjs';
import { TicketsService } from 'src/app/services/tickets.service';
import { LoadingComponent } from "../../shared/loading.component";
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
    selector: 'app-chart-doughnut',
    standalone: true,
    imports: [CommonModule, LoadingComponent],
    templateUrl: './chart-doughnut.component.html',
    styleUrls: ['./chart-doughnut.component.scss']
})
export class ChartDoughnutComponent {

  users: iUserGraph[] = [];
  tickets: iTicketGraph[] = [];
  myChart: any;
  titleEs: string = 'Incidencias por técnico';
  titleEn: string = 'Tickets by technician';
  title: string = this.titleEs;
  private langUpdateSubscription: Subscription = {} as Subscription;
  loading$: Observable<boolean>;
  isFirstLoad: boolean = true;

  constructor(private apiService: ApiService, private langUpdateService: LanguageUpdateService,
              private ticketsService: TicketsService, private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
   }

  ngOnInit() {
    if(localStorage.getItem('selectedLanguage') == 'en'){
      this.title = this.titleEn;
    }else if(localStorage.getItem('selectedLanguage') == 'es'){
      this.title = this.titleEs;
    }
    if(localStorage.getItem('userRole') == 'SupportManager') {
      this.ticketsService.users$.subscribe(users => {
        this.users = users;
        if(!this.isFirstLoad){
          this.createChart();
          this.loadingService.hideLoading();
        }
        this.isFirstLoad = false
      });
      this.ticketsService.usersGraph$.subscribe(usersGraph => {
        this.tickets = usersGraph;
        if(!this.isFirstLoad){
          this.createChart();
          this.loadingService.hideLoading();
        }
        this.isFirstLoad = false
      });
    }else{
      const userName = localStorage.getItem('userName');
      const userId = localStorage.getItem('userId');
      this.users[0] = {id: parseInt(userId!), userName: userName, fullName: ''};
      this.ticketsService.ticketGraphs$.subscribe(ticketGraphs => {
        this.tickets = ticketGraphs;
        if(!this.isFirstLoad){
        this.createChart();
        this.loadingService.hideLoading();
        }
        this.isFirstLoad = false
      })
    }
    this.langUpdateSubscription = this.langUpdateService.langUpdated$.subscribe(() => {
      this.switchLanguage();
    });
  }

  /**
   * Cambia el idioma del título
   */
  switchLanguage() {
    if(localStorage.getItem('selectedLanguage') == 'en'){
      this.title = this.titleEn;
    }else if(localStorage.getItem('selectedLanguage') == 'es'){
      this.title = this.titleEs;
    }
    this.createChart();
  }

  /**
   * Crea el gráfico.
   */
  createChart(): void {

    if (!this.users || !this.tickets) {
        return;
    }
    if(this.myChart) {
      this.myChart.destroy();
    }

    const technicianNames = this.users.map(user => user.userName); // Obtener nombres de los técnicos
    const technicianIds = this.users.map(user => user.id);
    const incidentCounts = technicianIds.map(id => {
      // Calcular el número de incidentes para cada técnico
      return this.tickets.filter(ticket => ticket.userId === id).length;
    });

    Chart.register(...registerables);

    const ctx = document.getElementById('technicianChart2') as HTMLCanvasElement;
    this.myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: technicianNames,
        datasets: [{
          label: 'Cantidad de incidencias',
          data: incidentCounts,
          backgroundColor: [
            'rgba(232, 19, 87, 1)',
            'rgba(116, 92, 216, 1)',
            'rgba(253, 183, 63, 1)',
            'rgba(59, 235, 151, 1)',
            'rgba(59, 214, 235, 1)',
            'rgba(255, 255, 255, 1)'
          ],
          borderColor: [
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
        responsive: true,
        plugins: {   
          legend: {
            labels: {
              color: 'white'
            }
          },
          title: {
            display: true,
            text: this.title,
            color: '#EFB810',
            font: {
              size: 28
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false
            },
            ticks: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              display: false
            }
          }
        },
        
      }
    });
  }
}
