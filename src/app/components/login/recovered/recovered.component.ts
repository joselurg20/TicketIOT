import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../button/button.component";
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { LenguageComponent } from "../../lenguage/lenguage.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-recovered',
    standalone: true,
    templateUrl: './recovered.component.html',
    styleUrls: ['./recovered.component.scss'],
    imports: [CommonModule, ButtonComponent, ReactiveFormsModule, FormsModule, LenguageComponent, TranslateModule]
})
export class RecoveredComponent implements OnInit {

    recoveryForm!: FormGroup;
    email: string = '';

    constructor(private router: Router, private apiService: ApiService, private translate: TranslateService) {
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
            Email: new FormControl('', [Validators.required, Validators.email])
        });
    }

    /**
     * Vuelve a la pantalla de inicio de sesión.
     */
    goBack() {
        this.router.navigate(['/login']);
    }

    /**
     * Envía el email para restablecer la contraseña.
     */
    resetPassword() {
        const Email = this.recoveryForm.value.Email;
        const emailParts = Email.match(/^([^@]+)@(.+)\.(.+)$/);

        if (emailParts && emailParts.length === 4) {
            const username = emailParts[1];
            const domain = emailParts[2];
            const tld = emailParts[3];

            this.apiService.checkEmail(username, domain, tld).subscribe({
                next: (response) => {
                    console.log('Email enviado:', response);
                    this.router.navigate(['/login']);
                },
                error: (error) => {
                    console.error('Error al enviar el email:', error);
                }
            })
        }
    }
}
