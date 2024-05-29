import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { UsersService } from 'src/app/services/users/users.service';
import { Routes } from 'src/app/utilities/routes';
import { ButtonComponent } from "../../button/button.component";
import { LanguageComponent } from "../../language/language.component";
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { AlertComponent } from '../../snackbars/alert/alert.component';
import { SnackbarIncidenceComponent } from '../../snackbars/snackbar-incidence/snackbar-incidence.component';

@Component({
  selector: 'app-incidence-index',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatFormFieldModule, MatTooltipModule, SidebarComponent, MatSelectModule, MatInputModule, 
    ReactiveFormsModule, LanguageComponent, ButtonComponent, TranslateModule, MatSnackBarModule, SnackbarIncidenceComponent, AlertComponent],
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
  isLogged: boolean = false;
  selectedFiles: File[] = [];
  durationInSeconds = 5;
  selectFilesNames: string[] = [];
  currentIndex: number = 0;

  constructor(private _snackBar: MatSnackBar, private ticketsService: TicketsService, private translate: TranslateService, private usersService: UsersService, private router: Router) {
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use('es');
    }
  }

  openSnackBar(message: string = '', durationInSeconds: number = this.durationInSeconds) {
  if (this.ticketForm.valid && message === '') {
    this._snackBar.openFromComponent(SnackbarIncidenceComponent, {
      duration: durationInSeconds * 1000,
    });
  } else {
    this._snackBar.openFromComponent(AlertComponent, {
      duration: durationInSeconds * 1000,
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

    if (this.usersService.currentUser?.id) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
    console.log('currentUser', this.usersService.currentUser);
    console.log('isLogged', this.isLogged);
  }

  onSubmit() {
    if (this.ticketForm.valid) {
      const { Title, Content, Name, Email } = this.ticketForm.value;

      this.createTicket(Title, Content, Name, Email)
        .subscribe({
          next: () => {
            this.ticketForm.reset();
          
            setTimeout(() => {
              this.clearAttachments();
              this._snackBar.openFromComponent(SnackbarIncidenceComponent, {
                duration: this.durationInSeconds * 1000,
              });
            }, 1000);
            if (this.isLogged) {
              this.router.navigate([Routes.supportManager]);
            }
          },
          error: (error) => {
            this._snackBar.openFromComponent(AlertComponent);
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

    for (let file of this.selectedFiles) {
      formData.append('MessageDTO.Attachments', file, file.name);
    }

    this.selectedFiles = [];
    this.previewUrls = [];
    this.isFileSelected = false;

    return this.ticketsService.createTicket(formData);
  }

  onFileChange(event: any) {
    const files: File[] = Array.from(event.target.files);
    this.selectedFiles = files;
    this.isFileSelected = files.length > 0;
    this.previewUrls = [];
    this.selectFilesNames = [];
  
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = () => {
        let previewUrl: string | ArrayBuffer | null = reader.result;
  
        switch (file.type) {
          case 'image/jpeg':
          case 'image/png':
          case 'image/gif':
            // Imágenes: mantener el reader.result como previewUrl
            break;
          case 'application/pdf':
            // PDF: Asignar una imagen específica
            previewUrl = 'assets/images/file-previews/pdf_file.png';
            break;
          case 'application/msword':
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            // Documentos de Word: Asignar una imagen específica
            previewUrl = 'assets/images/file-previews/doc_file.png';
            break;
          case 'application/vnd.ms-excel':
          case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            // Documentos de Excel: Asignar una imagen específica
            previewUrl = 'assets/images/file-previews/xls_file.png';
            break;
          case 'text/plain':
            // Archivos de texto: Asignar una imagen específica
            previewUrl = 'assets/images/file-previews/txt_file.png';
            break;
          case 'application/x-compressed':
          case 'application/x-zip-compressed':
          case 'application/x-7z-compressed':
            // Archivos comprimidos: Asignar una imagen específica
            previewUrl = 'assets/images/file-previews/rar_file.png';
            break;
          case 'audio/mpeg':
          case 'audio/wav':
            // Archivos de audio: Asignar una imagen específica
            previewUrl = 'assets/images/file-previews/audio_file.png';
            break;
          case 'video/mp4':
          case 'video/avi':
          case 'video/x-matroska':
            // Archivos de video: Asignar una imagen específica
            previewUrl = 'assets/images/file-previews/video_file.png';
            break;
          default:
            // Otros tipos de archivo: Asignar una imagen por defecto
            previewUrl = 'assets/images/file-previews/unknown_file.png';
            break;
        }
  
        this.previewUrls.push(previewUrl);
        this.selectFilesNames.push(file.name);
      };
  
      reader.readAsDataURL(file);
    }
  }
  
  isImage(previewUrl: string | ArrayBuffer | null): boolean {
    if (typeof previewUrl === 'string' && previewUrl.startsWith('data:image')) {
      return true;
    }
    return false;
  }

  deleteFile(index: number) {
    this.previewUrls.splice(index, 1);
    this.selectFilesNames.splice(index, 1);
    this.selectedFiles.splice(index, 1);
    this.isFileSelected = this.previewUrls.length > 0;

    const fileInput = <HTMLInputElement>document.getElementById('Attachments');
    if (fileInput) {
      fileInput.value = '';
    }
  }

  nextFile() {
    if (this.currentIndex < this.previewUrls.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  prevFile() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.previewUrls.length - 1;
    }
  }

  truncateFileName(fileName: string, maxLength: number): string {
    if (fileName.length > maxLength) {
      return fileName.substr(0, maxLength) + '...';
    }
    return fileName;
  }

  clearAttachments() {
    const fileInput = <HTMLInputElement>document.getElementById('Attachments');
    if (fileInput) {
      fileInput.value = '';
    }
    this.previewUrls = [];
    this.selectFilesNames = [];
    this.selectedFiles = [];
    this.isFileSelected = false;
  }
}