import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { iTicketGraph } from 'src/app/models/tickets/iTicketsGraph';
import { ApiService } from 'src/app/services/api.service';

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

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    if(localStorage.getItem('userRole') == 'SupportManager') {
      this.apiService.getTickets().subscribe({
        next: (response: any) => {
          console.log('Tickets recibidos', response);
          // Mapear la respuesta de la API utilizando la interfaz iTicketTable
          const tickets: iTicketGraph[] = response.$values.map((value: any) => {
            return {
              priority: value.priority,
              state: value.state,
              userId: value.userId // Asegúrate de asignar el valor correcto
            };
          });
          this.tickets = tickets; // Establecer los datos en la dataSource
          console.log('Datos mapeados para tabla', tickets);
          this.createChart();
        },
        error: (error: any) => {
          console.error('Error al obtener los tickets del usuario:', error);
        }
      });
    } else {
      this.apiService.getTicketsByUser(parseInt(localStorage.getItem('userId')!)).subscribe({
        next: (response: any) => {
          console.log('Tickets recibidos', response);
          // Mapear la respuesta de la API utilizando la interfaz iTicketTable
          const tickets: iTicketGraph[] = response.$values.map((value: any) => {
            return {
              priority: value.priority,
              state: value.state,
              userId: value.userId // Asegúrate de asignar el valor correcto
            };
          });
          this.tickets = tickets; // Establecer los datos en la dataSource
          console.log('Datos mapeados para tabla', tickets);
          this.createChart();
        },
        error: (error: any) => {
          console.error('Error al obtener los tickets del usuario:', error);
        }
      });
    }
  }

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
            'rgba(232, 19, 87, 0.2)',
            'rgba(116, 92, 216, 0.2)',
            'rgba(253, 183, 63, 0.2)',
            'rgba(59, 235, 151, 0.2)',
            'rgba(59, 214, 235, 0.2)',
            'rgba(255, 255, 255, 0.2)'
          ],
          borderColor: [
            'rgba(232, 19, 87, 1)',
            'rgba(116, 92, 216, 1)',
            'rgba(253, 183, 63, 1)',
            'rgba(59, 235, 151, 1)',
            'rgba(59, 214, 235, 1)',
            'rgba(255, 255, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
