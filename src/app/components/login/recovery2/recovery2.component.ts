import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as CryptoJS from 'crypto-js';
import { ApiService } from 'src/app/services/api.service';
import { LenguageComponent } from "../../lenguage/lenguage.component";
import { SnackbarPasswordComponent } from '../../snackbars/snackbar-password/snackbar-password.component';

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
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule, LenguageComponent, MatProgressSpinnerModule],
  templateUrl: './recovery2.component.html',
  styleUrls: ['./recovery2.component.scss']
})
export class Recovery2Component implements OnInit {

  recoveryForm!: FormGroup;
  username: string = '';
  domain: string = '';
  tld: string = '';
  email: string = '';
  hash: string = '';
  durationInSeconds = 5;

  constructor(private route: ActivatedRoute,private fb:FormBuilder, private _snackBar: MatSnackBar,
              private router: Router, private apiService: ApiService, private translate: TranslateService) {
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
      this.email = this.username.concat('@', this.domain, '.', this.tld);
      const hashedEmail = CryptoJS.SHA256(this.email).toString();
      this.hash = params['hash'];
      if (hashedEmail !== this.hash) {
        this.router.navigate(['/404']);
      }
    });
  }

  /**
   * Comprueba si las contraseñas introducidas coinciden y, si coinciden, restablece la contraseña.
   * @returns 
   */
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

    const hashedPassword = CryptoJS.SHA256(password).toString().concat('@', 'A', 'a');

    // Si las contraseñas coinciden, continuar con el proceso de restablecimiento de contraseña
    const formData = new FormData();
    formData.append('Username', this.username);
    formData.append('Domain', this.domain);
    formData.append('Tld', this.tld);
    formData.append('Password', hashedPassword);

    this.apiService.resetPassword(formData).subscribe({
      next: (response) => {
        this.router.navigate(['/cls']);
      },
      error: (error) => {
        console.error('Error al restablecer la contraseña:', error);
      }
    });
  }

  openSnackBar() {
    if (passwordValidator===null) {
      this._snackBar.openFromComponent(SnackbarPasswordComponent, {
      duration: this.durationInSeconds * 1000,
    });
    }
  }
}