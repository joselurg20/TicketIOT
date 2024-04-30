import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Observable, Subscription } from 'rxjs';
import { iTicketGraph } from 'src/app/models/tickets/iTicketsGraph';
import { LanguageUpdateService } from 'src/app/services/languageUpdateService';
import { TicketsService } from 'src/app/services/tickets.service';
import { Status } from 'src/app/utilities/enum';
import { LoadingComponent } from "../../shared/loading.component";
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-chart-bar',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.scss']
})
export class ChartBarComponent implements OnInit {

  tickets: iTicketGraph[] = [];
  myChart: any;
  titleEs: string = 'Incidencias por estado';
  titleEn: string = 'Tickets by status';
  title: string = this.titleEs;
  labelsEs: string[] = ['ABIERTA', 'PAUSADA', 'PENDIENTE'];
  labelsEn: string[] = ['OPENED', 'PAUSED', 'PENDING'];
  labels: string[] = this.labelsEs;
  loading$: Observable<boolean>;
  private langUpdateSubscription: Subscription = {} as Subscription;
  isFirstLoad: boolean = true;

  constructor(private ticketsService: TicketsService, private langUpdateService: LanguageUpdateService,
              private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit() {
    this.loadingService.showLoading();
    if (localStorage.getItem('selectedLanguage') == 'en') {
      this.title = this.titleEn;
      if(localStorage.getItem('userRole') == 'SupportManager') {
        this.labels = this.labelsEn;
      }else{
        this.labels = ['OPENED', 'PAUSED'];
      }
    }else if(localStorage.getItem('selectedLanguage') == 'es'){
      this.title = this.titleEs;
      if(localStorage.getItem('userRole') == 'SupportManager') {
        this.labels = this.labelsEs;
      }else{
        this.labels = ['ABIERTA', 'PAUSADA'];
      }
    }
    this.ticketsService.ticketGraphs$.subscribe(tickets => {
      this.loadingService.showLoading();
      this.tickets = tickets;
      this.createChart();
      this.loadingService.hideLoading();
    });
    this.langUpdateSubscription = this.langUpdateService.langUpdated$.subscribe(() => {
      this.loadingService.showLoading();
      this.switchLanguage();
      this.loadingService.hideLoading();
    });
  }

  /**
   * Cambia el idioma del gráfico
   */
  switchLanguage() {
    if (localStorage.getItem('selectedLanguage') == 'en') {
      this.title = this.titleEn;
      if(localStorage.getItem('userRole') == 'SupportManager') {
        this.labels = this.labelsEn;
      }else{
        this.labels = ['OPENED', 'PAUSED'];
      }
    }else if(localStorage.getItem('selectedLanguage') == 'es'){
      this.title = this.titleEs;
      if(localStorage.getItem('userRole') == 'SupportManager') {
        this.labels = this.labelsEs;
      }else{
        this.labels = ['ABIERTA', 'PAUSADA'];
      }
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
    this.myChart?.destroy();
    var status: Status[] = [];
    if(localStorage.getItem('userRole') == 'SupportManager') {
      status = [1, 2, 0];
    }else{
      status = [1, 2];
    }

    const incidentCounts = status.map(status => {
      return this.tickets.filter((ticket: { status: Status; }) => ticket.status === status).length;
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
        labels: this.labels,
        datasets: [{
          label: '',
          data: incidentCounts,
          backgroundColor: [
            'rgba(59, 235, 151, 1)',
            '#e06236',
            'grey'
          ],
          borderColor: [
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
              size: 28
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
