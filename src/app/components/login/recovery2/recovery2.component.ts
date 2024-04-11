import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { iResetPasswordDto } from 'src/app/models/users/iResetPasswordDto';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LenguageComponent } from "../../lenguage/lenguage.component";
import * as CryptoJS from 'crypto-js';

function passwordValidator(control: FormControl): { [key: string]: any } | null {
  const hasUppercase = /[A-Z]/.test(control.value); // Verifica si hay al menos una letra mayúscula
  const hasNumber = /\d/.test(control.value); // Verifica si hay al menos un dígito numérico
  const hasNonAlphanumeric = /\W/.test(control.value); // Verifica si hay al menos un carácter no alfanumérico

  if (control.value && control.value.length >= 6 && hasUppercase && hasNumber && hasNonAlphanumeric) {
    return null; // La contraseña cumple con todos los requisitos
  } else {
    return { 'passwordRequirements': true }; // La contraseña no cumple con los requisitos
  }
}

@Component({
    selector: 'app-recovery2',
    standalone: true,
    templateUrl: './recovery2.component.html',
    styleUrls: ['./recovery2.component.scss'],
    imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule, LenguageComponent]
})
export class Recovery2Component implements OnInit {

  recoveryForm!: FormGroup;
  username: string = '';
  domain: string = '';
  tld: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService, private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use('es');
      
    }
  }

  ngOnInit(): void {
    this.recoveryForm = new FormGroup({
      Password: new FormControl('', [Validators.required, passwordValidator]),
      RepeatPassword: new FormControl('', [Validators.required, passwordValidator])
    });
    this.route.params.subscribe(params => {
      this.username = params['username'];
      this.domain = params['domain'];
      this.tld = params['tld'];
    });
  }

  resetPassword() {
    const password = this.recoveryForm.value.Password;
    const repeatPassword = this.recoveryForm.value.RepeatPassword;
  
    // Verificar si las contraseñas coinciden
    if (password !== repeatPassword) {
      if (this.translate.currentLang === 'es') {
        alert('Las contraseñas no coinciden');
      } else {
        alert('Passwords do not match');
      }
      return; 
    }

    
    const hashedPassword = CryptoJS.SHA256(password).toString().concat('@','A','a');
  
    // Si las contraseñas coinciden, continuar con el proceso de restablecimiento de contraseña
    const formData = new FormData();
    formData.append('Username', this.username);
    formData.append('Domain', this.domain);
    formData.append('Tld', this.tld);
    formData.append('Password', hashedPassword);
  
    this.apiService.resetPassword(formData).subscribe({
      next: (response) => {
        console.log('Contraseña restablecida:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al restablecer la contraseña:', error);
      }
    });
  }
}
