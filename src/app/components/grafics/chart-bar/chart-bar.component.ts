import { CommonModule } from '@angular/common';
import { R3TargetBinder } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { iTicketTable } from 'src/app/models/tickets/iTicketTable';
import { iTicketGraph } from 'src/app/models/tickets/iTicketsGraph';
import { iUserTable } from 'src/app/models/users/iUserTable';
import { ApiService } from 'src/app/services/api.service';

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

  constructor(private apiService: ApiService) { }

  ngOnInit() {

    if(localStorage.getItem('userRole') == 'SupportManager') {
      this.apiService.getTicketsByUser(-1).subscribe({
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

  createChart(): void {

    if(this.myChart) {
      this.myChart.destroy();
    }
    var states: string[] = [];
    Chart.register(...registerables);
    if(localStorage.getItem('userRole') == 'SupportManager') {
      states = ['PENDING', 'OPENED', 'PAUSED'];
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
          label: 'Cantidad de incidencias',
          data: incidentCounts,
          backgroundColor: [
            'rgba(232, 19, 87, 1)',
            'rgba(116, 92, 216, 1)',
            'rgba(253, 183, 63, 1)',
            'rgba(59, 235, 151, 1)',
          ],
          borderColor: [
            'rgba(232, 19, 87, 1)',
            'rgba(116, 92, 216, 1)',
            'rgba(253, 183, 63, 1)',
            'rgba(59, 235, 151, 1)',
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
