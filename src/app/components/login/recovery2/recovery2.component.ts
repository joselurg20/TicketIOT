import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { iResetPasswordDto } from 'src/app/models/users/iResetPasswordDto';

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
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './recovery2.component.html',
  styleUrls: ['./recovery2.component.scss']
})
export class Recovery2Component implements OnInit {

  recoveryForm!: FormGroup;
  username: string = '';
  domain: string = '';
  tld: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) { }

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

    if (password === repeatPassword) {
      const formData = new FormData();
      formData.append('Username', this.username);
      formData.append('Domain', this.domain);
      formData.append('Tld', this.tld);
      formData.append('Password', password);
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
}