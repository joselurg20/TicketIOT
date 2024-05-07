import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ButtonComponent } from "../../button/button.component";
import { ChartBarComponent } from '../../grafics/chart-bar/chart-bar.component';
import { ChartDoughnutComponent } from '../../grafics/chart-doughnut/chart-doughnut.component';
import { ChartPieComponent } from '../../grafics/chart-pie/chart-pie.component';
import { LenguageComponent } from "../../lenguage/lenguage.component";
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { SnackbarIncidenceComponent } from '../../snackbars/snackbar-incidence/snackbar-incidence.component';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { LocalStorageKeys } from 'src/app/utilities/literals';


@Component({
  selector: 'app-incidence-index',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatFormFieldModule,
    MatSelectModule, MatButtonModule, MatSnackBarModule, MatInputModule, MatButtonModule,
    MatSnackBarModule, ChartBarComponent, ChartPieComponent,
    ChartDoughnutComponent, ButtonComponent, SidebarComponent, LenguageComponent, TranslateModule],
  templateUrl: './incidence-index.component.html',
  styleUrls: ['./incidence-index.component.scss']

})
export class IncidenceIndexComponent implements OnInit {

  public ticketForm!: FormGroup;
  successMsg: string = "";
  successMessage: string = "";
  previewUrls: Array<string | ArrayBuffer | null> = new Array();
  isFileSelected: boolean = false;
  isImageSelected: boolean = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  isLogged: boolean = false;
  selectedFiles: File[] = [];
  durationInSeconds = 5;
  selectFilesNames: string[] = [];
  isSupportManager: boolean = true;


  constructor(private _snackBar: MatSnackBar, private ticketsService: TicketsService, private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use('es');

    }
  }

  openSnackBar() {
    if (this.ticketForm.valid) {
      this._snackBar.openFromComponent(SnackbarIncidenceComponent, {
        duration: this.durationInSeconds * 1000,
      });
    } else {
      this._snackBar.openFromComponent(SnackbarIncidenceComponent, {
        duration: this.durationInSeconds * 1000,
      });
    }
  }

  ngOnInit() {
    this.ticketForm = new FormGroup({
      Title: new FormControl('', [Validators.required, Validators.maxLength(45)]),
      Content: new FormControl('', Validators.required),
      Attachments: new FormControl('', null),
      Name: new FormControl('', [Validators.required, Validators.maxLength(45)]),
      Email: new FormControl('', [Validators.required, Validators.email])
    });

    if (localStorage.getItem(LocalStorageKeys.tokenKey) != null) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
  }


  /**
   * Envía los datos del formulario.
   */
  onSubmit() {
    if (this.ticketForm.valid) {
      const Title = this.ticketForm.value.Title;
      const Content = this.ticketForm.value.Content;
      const Name = this.ticketForm.value.Name;
      const Email = this.ticketForm.value.Email;

      this.createTicket(Title, Content, Name, Email)
        .subscribe({
          next: (response) => {
            this.ticketForm.reset();
            setTimeout(() => {
              this.clearAttachments(); // Limpiar campos del formulario
            }, 1000);
            window.location.href = '/support-manager';
          },
          error: (error) => {
            console.error('Error en la solicitud', error);
            this.successMsg = "Error al crear la incidencia.";
          }
        });
    }
  }

  /**
   * Crea una nueva incidencia con los datos pasados como parámetro.
   * @param Title el titulo de la incidencia.
   * @param Content el contenido de la incidencia.
   * @param Name el nombre del usuario que crea la incidencia.
   * @param Email el email del usuario que crea la incidencia.
   * @returns
   */
  createTicket(Title: string, Content: string, Name: string, Email: string): Observable<any> {
    const formData = new FormData();
    formData.append('TicketDTO.Title', Title);
    formData.append('TicketDTO.Name', Name);
    formData.append('TicketDTO.Email', Email);
    formData.append('TicketDTO.HasNewMessages', 'true');
    formData.append('MessageDTO.Author', Name);
    formData.append('MessageDTO.Content', Content);

    var attachments = this.selectedFiles;

    if (attachments.length > 0) {

      if (attachments.length == 1) {
        const fileInput = <HTMLInputElement>document.getElementById('Attachments');
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
          formData.append('MessageDTO.Attachments', fileInput.files[0], fileInput.files[0].name);
        }
      } else if (attachments.length > 0) {
        for (var attachment of attachments) {
          formData.append('MessageDTO.Attachments', attachment, attachment.name);
        }
      }
    }
    this.selectedFiles = [];
    this.previewUrls = new Array();
    this.isFileSelected = false;

    return this.ticketsService.createTicket(formData);
  }


  isImage(previewUrl: string | ArrayBuffer | null): boolean {
    if (typeof previewUrl === 'string' && previewUrl.startsWith('data:image')) {
      return true;
    }
    return false;
  }


  /**
   * Cambia la previsualización del archivo adjunto.
   * @param event el evento que lanza la función.
   */
  onFileChange(event: any) {
    this.selectedFiles = event.target.files;
    const files = this.selectedFiles;
    this.isFileSelected = true;
    for (let file of files) {
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          // Verificar el tipo de archivo
          if (file.type) {

            switch (file.type) {
              case 'image/jpeg':
              case 'image/png':
              case 'image/gif':
                this.previewUrls.push(reader.result);
                break;
              case 'application/pdf':
                // Asignar una imagen para PDF
                this.previewUrls.push('assets/images/file-previews/pdf_file.png');
                break;
              case 'application/msword':
              case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                // Asignar una imagen para Word
                this.previewUrls.push('assets/images/file-previews/doc_file.png');
                break;
              case 'application/vnd.ms-excel':
              case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                // Asignar una imagen para Excel
                this.previewUrls.push('assets/images/file-previews/xls_file.png');
                break;
              case 'text/plain':
                // Asignar una imagen para archivos de texto
                this.previewUrls.push('assets/images/file-previews/txt_file.png');
                break;
              case 'application/x-compressed':
              case 'application/x-zip-compressed':
              case 'application/x-7z-compressed':
                // Asignar una imagen para archivos comprimidos
                this.previewUrls.push('assets/images/file-previews/rar_file.png');
                break;
              case 'audio/mpeg':
              case 'audio/wav':
                // Asignar una imagen para archivos de audio
                this.previewUrls.push('assets/images/file-previews/audio_file.png');
                break;
              case 'video/mp4':
              case 'video/avi':
              case 'video/x-matroska':
                // Asignar una imagen para archivos de video
                this.previewUrls.push('assets/images/file-previews/video_file.png');
                break;
              default:
                // Asignar una imagen por defecto para otros tipos de archivo
                this.previewUrls.push('assets/images/file-previews/unknown_file.png');
            }
          }
          this.selectFilesNames.push(file.name);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  /**
   * Limpia los archivos adjuntos del formulario.
   */
  clearAttachments() {
    this.ticketForm.get('Attachments')?.reset();
    this.previewUrls = [];
    this.isImageSelected = false;
  }
}