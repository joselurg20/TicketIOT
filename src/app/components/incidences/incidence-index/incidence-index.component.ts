import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { ChartBarComponent } from '../../grafics/chart-bar/chart-bar.component';
import { ChartDoughnutComponent } from '../../grafics/chart-doughnut/chart-doughnut.component';
import { ChartPieComponent } from '../../grafics/chart-pie/chart-pie.component';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-incidence-index',
  standalone: true,
  templateUrl: './incidence-index.component.html',
  styleUrls: ['./incidence-index.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatSnackBarModule, MatInputModule, MatButtonModule, MatSnackBarModule, ChartBarComponent, ChartPieComponent, ChartDoughnutComponent]
})
export class IncidenceIndexComponent implements OnInit {
  public ticketForm!: FormGroup;
  successMsg: string = "";
  successMessage: string = "";
  previewUrl: string | ArrayBuffer | null = null;
  isImageSelected: boolean = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private apiService: ApiService) { }

  openSnackBar() {
    this._snackBar.open("Incidencia enviada", 'Cerrar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3000, 
      panelClass: ['green-snackbar'] 
    });
  }


  ngOnInit() {
    this.ticketForm = new FormGroup({
      Title: new FormControl('', Validators.required),
      Content: new FormControl('', Validators.required),
      Attachments: new FormControl('', null),
      Name: new FormControl('', Validators.required),
      Email: new FormControl('', [Validators.required, Validators.email])
    });
  }


  onSubmit() {
    if (this.ticketForm.valid) {
      console.log('Datos del formulario:', this.ticketForm.value);
      const Title = this.ticketForm.value.Title;
      const Content = this.ticketForm.value.Content;
      const Name = this.ticketForm.value.Name;
      const Email = this.ticketForm.value.Email;
  
      this.createTicket(Title, Content, Name, Email)
        .subscribe({
          next: (response) => {
            console.log('Ticket creado con éxito', response);
            this.openSnackBar(); // Mostrar toast
            this.ticketForm.reset();
            this.clearAttachments(); // Limpiar campos del formulario
          },
          error: (error) => {
            console.error('Error en la solicitud', error);
            this.successMsg = "Error al crear la incidencia.";
          }
        });
    }
  }

  createTicket(Title: string, Content: string, Name: string, Email: string): Observable<any> {
    const formData = new FormData();
    formData.append('TicketDTO.Title', Title);
    formData.append('TicketDTO.Name', Name);
    formData.append('TicketDTO.Email', Email);
    formData.append('TicketDTO.HasNewMessages', 'true');
    formData.append('MessageDTO.Author', Name);
    formData.append('MessageDTO.Content', Content);

    const attachmentsControl = this.ticketForm.get('Attachments');

    if (attachmentsControl) {
      const attachments = attachmentsControl.value;

      if (typeof attachments === 'string') {
        const fileInput = <HTMLInputElement>document.getElementById('Attachments');
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
          formData.append('MessageDTO.Attachments', fileInput.files[0], fileInput.files[0].name);
        }
      } else if (Array.isArray(attachments) && attachments.length > 0) {
        for (const attachment of attachments) {
          formData.append('MessageDTO.Attachments', attachment, attachment.name);
        }
      }
    }

    return this.apiService.createTicket(formData);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
      this.isImageSelected = file.type.startsWith('image/');
    }
  }


  clearAttachments() {
    this.ticketForm.get('Attachments')?.reset();
    this.previewUrl = null;
    this.isImageSelected = false;
  }
}