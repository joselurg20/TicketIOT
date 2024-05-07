import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { iTicketGraph } from 'src/app/models/tickets/iTicketsGraph';
import { iUserGraph } from 'src/app/models/users/iUserGraph';
import { LanguageUpdateService } from 'src/app/services/languageUpdateService';
import { Observable, Subscription } from 'rxjs';
import { TicketDataService } from 'src/app/services/tickets/ticketData.service';
import { LoadingComponent } from "../../shared/loading.component";
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageKeys , Roles } from 'src/app/utilities/literals';
import { iUser } from 'src/app/models/users/iUser';
import { UsersService } from 'src/app/services/users/users.service';

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

  constructor(private langUpdateService: LanguageUpdateService, private ticketsService: TicketDataService,
              private loadingService: LoadingService, private usersService: UsersService) {
    this.loading$ = this.loadingService.loading$;
   }

  ngOnInit() {
    setTimeout(() => {
    
    if(localStorage.getItem(LocalStorageKeys.selectedLanguage) == 'en'){
      this.title = this.titleEn;
    }else if(localStorage.getItem(LocalStorageKeys.selectedLanguage) == 'es'){
      this.title = this.titleEs;
    }  
    if(this.usersService.currentUser?.role === Roles.managerRole) {
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
      if(this.usersService.currentUser !== null) {
        var user: iUserGraph | null = {id: this.usersService.currentUser.id,
                                userName: this.usersService.currentUser.userName,
                                fullName: this.usersService.currentUser.fullName};
        console.log('ticketGraph', user)
        this.users[0] = user;
        this.ticketsService.ticketGraphs$.subscribe(ticketGraphs => {
          this.tickets = ticketGraphs;
          this.createChart();
          this.loadingService.hideLoading();
        })
      }
      this.langUpdateSubscription = this.langUpdateService.langUpdated$.subscribe(() => {
        this.switchLanguage();
      });
    }
  }, 10)
  }

  /**
   * Cambia el idioma del título
   */
  switchLanguage() {
    if(localStorage.getItem(LocalStorageKeys.selectedLanguage) == 'en'){
      this.title = this.titleEn;
    }else if(localStorage.getItem(LocalStorageKeys.selectedLanguage) == 'es'){
      this.title = this.titleEs;
    }
    this.createChart();
  }

  /**
   * Crea el gráfico.
   */
  createChart(): void {
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
