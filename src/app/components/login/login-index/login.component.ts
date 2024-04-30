import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as CryptoJS from 'crypto-js';
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from '../../../services/login.service';
import { LenguageComponent } from "../../lenguage/lenguage.component";
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { LoadingComponent } from '../../shared/loading.component';
import { Observable } from 'rxjs';


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
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LenguageComponent, TranslateModule, SidebarComponent, MatProgressSpinnerModule, LoadingComponent]
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup; // Define loginForm como un FormGroup
  public errorMsg: string = "";
  loading$: Observable<boolean>;	

  constructor(private loginService: LoginService, private loadingService: LoadingService,
              private router: Router, private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use('es');
    }
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, passwordValidator])
    });
  }

  /**
   * Envia la solicitud de inicio de sesión al backend.
   */
  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      const hashedPassword = CryptoJS.SHA256(password).toString().concat('@', 'A', 'a');

      // Muestra el indicador de carga antes de iniciar la carga de datos
      this.loadingService.showLoading();

      // Enviar solicitud de inicio de sesión
      this.loginService.login(email, hashedPassword).subscribe({
        next: (response) => {
          // Oculta el indicador de carga una vez que los datos se han cargado
          this.loadingService.hideLoading();

          this.errorMsg = "";
          localStorage.setItem('jwtToken', response);
          if (localStorage.getItem('userRole') == 'SupportManager') {
            this.router.navigate(['/support-manager']);
          } else if (localStorage.getItem('userRole') == 'SupportTechnician') {
            this.router.navigate(['/support-technician']);
          }
        },
        error: (error) => {
          console.error('Error en la solicitud:', error);
          this.errorMsg = "Email o contraseña no válidos.";

          // En caso de error, también oculta el indicador de carga
          this.loadingService.hideLoading();
        }
      });
    }
  }
}