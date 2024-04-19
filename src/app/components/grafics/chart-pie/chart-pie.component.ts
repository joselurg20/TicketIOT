import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { iTicketGraph } from 'src/app/models/tickets/iTicketsGraph';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-chart-pie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-pie.component.html',
  styleUrls: ['./chart-pie.component.scss']
})
export class ChartPieComponent {

  tickets: iTicketGraph[] = [];
  myChart: any;

  constructor(private ticketsService: TicketsService) {}

  ngOnInit() {
    this.ticketsService.ticketGraphs$.subscribe(tickets => {
      this.tickets = tickets;
      this.createChart();
    });

  }

  /**
   * Crea el gráfico.
   */
  createChart(): void{

    if(this.myChart){
      this.myChart.destroy();
    }

    const priorities: string[] = ['HIGHEST', 'HIGH', 'MEDIUM', 'LOW', 'LOWEST', 'NOT_SURE'];

    const incidentCounts = priorities.map(prio => {
      // Calcular el número de incidentes para cada técnico
      return this.tickets.filter((ticket: { priority: string; }) => ticket.priority === prio).length;
    });

    Chart.register(...registerables);

    const ctx = document.getElementById('technicianChart') as HTMLCanvasElement;
    this.myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: priorities,
        datasets: [{
          label: 'Cantidad de incidencias',
          data: incidentCounts,
          backgroundColor: [
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
            text: 'Prioridades de incidencias',
            color: '#0c7c80',
            font: {
              size: 20
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
        }
      }
    });
  }
}
