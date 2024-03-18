import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-incidence',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './incidence-index.component.html',
  styleUrls: ['./incidence-index.component.scss']
})
export class IncidenceIndexComponent {
  previewUrl!: string | ArrayBuffer | null;
  isImageSelected: any;
  successMsg: any;


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


}
