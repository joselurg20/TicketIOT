import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';
import { LenguageComponent } from "../../lenguage/lenguage.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SidebarComponent } from "../../sidebar/sidebar.component";
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
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [CommonModule, ReactiveFormsModule, LenguageComponent, TranslateModule, SidebarComponent]
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup; // Define loginForm como un FormGroup
  public errorMsg: string = "";

  constructor(private loginService: LoginService, private router: Router, private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    const lang = this.translate.getBrowserLang();
    if (lang !== 'en' && lang !== 'es') {
      this.translate.setDefaultLang('en');
    } else {
      this.translate.use('es');
      
    }
  }

  ngOnInit() {
    // Inicializa el formulario y sus controles
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, passwordValidator])
    });
  }



  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      const hashedPassword = CryptoJS.SHA256(password).toString().concat('@','A','a');

      // Envia la solicitud de inicio de sesión al backend
      this.loginService.login(email, hashedPassword)
        .subscribe({
          next: (response) => {
            this.errorMsg = "";
            localStorage.setItem('jwtToken', response);
            console.log('Token JWT almacenado en localStorage:', response);
            if (localStorage.getItem('userRole') == 'SupportManager') {
              this.router.navigate(['/support-manager']);
            } else if (localStorage.getItem('userRole') == 'SupportTechnician') {
              this.router.navigate(['/support-technician']);
            }
          },
          error: (error) => {
            console.error('Error en la solicitud:', error);
            this.errorMsg = "Email o contraseña no válidos."
          }
        });
    }
  }
}