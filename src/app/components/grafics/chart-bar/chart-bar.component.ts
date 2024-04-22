import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { iTicketGraph } from 'src/app/models/tickets/iTicketsGraph';
import { GraphUpdateService } from 'src/app/services/graphUpdateService';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-chart-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.scss']
})
export class ChartBarComponent implements OnInit {

  tickets: iTicketGraph[] = [];
  myChart: any;
  titleEs: string = 'Incidencias por estado';
  titleEn: string = 'Tickets by state';
  title: string = this.titleEs;
  private graphUpdateSubscription: Subscription = {} as Subscription;

  constructor(private ticketsService: TicketsService, private graphUpdateService: GraphUpdateService) { }

  ngOnInit() {
    if(localStorage.getItem('selectedLanguage') == 'en'){
      this.title = this.titleEn;
    }else if(localStorage.getItem('selectedLanguage') == 'es'){
      this.title = this.titleEs;
    }
    this.ticketsService.ticketGraphs$.subscribe(tickets => {
      this.tickets = tickets;
      this.createChart();
    });
    this.graphUpdateSubscription = this.graphUpdateService.graphUpdated$.subscribe(() => {
      this.switchLanguage();
    })
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

    if(this.myChart) {
      this.myChart.destroy();
    }
    var states: string[] = [];
    Chart.register(...registerables);
    if(localStorage.getItem('userRole') == 'SupportManager') {
      states = ['OPENED', 'PAUSED', 'PENDING'];
    }else{
      states = ['OPENED', 'PAUSED'];
    }

    const incidentCounts = states.map(state => {
      // Calcular el número de incidentes para cada técnico
      return this.tickets.filter((ticket: { state: string; }) => ticket.state === state).length;
    });

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: states,
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
