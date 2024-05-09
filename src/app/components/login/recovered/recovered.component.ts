import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UsersService } from 'src/app/services/users/users.service';
import { Routes } from 'src/app/utilities/routes';
import { ButtonComponent } from "../../button/button.component";
import { LanguageComponent } from "../../language/language.component";
import { AlertComponent } from '../../snackbars/alert/alert.component';
import { SnackbarIncidenceComponent } from '../../snackbars/snackbar-incidence/snackbar-incidence.component';

@Component({
    selector: 'app-recovered',
    standalone: true,
    imports: [CommonModule, ButtonComponent, ReactiveFormsModule, FormsModule, LanguageComponent, TranslateModule],
    templateUrl: './recovered.component.html',
    styleUrls: ['./recovered.component.scss']
})
export class RecoveredComponent implements OnInit {

    recoveryForm!: FormGroup;
    email: string = '';
    durationInSeconds = 5;

    constructor(private router: Router, private _snackBar: MatSnackBar, private usersService: UsersService,
        private translate: TranslateService) {
        this.translate.addLangs(['en', 'es']);
        const lang = this.translate.getBrowserLang();
        if (lang !== 'en' && lang !== 'es') {
            this.translate.setDefaultLang('en');
        } else {
            this.translate.use('es');

        }
    }

    openSnackBar() {
        if (this.recoveryForm.valid) {
            this._snackBar.openFromComponent(SnackbarIncidenceComponent, {
                duration: this.durationInSeconds * 1000,
            });
        } else {
            this._snackBar.openFromComponent(AlertComponent, {
                duration: this.durationInSeconds * 1000,
            });
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
        this.router.navigate([Routes.login]);
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

            this.usersService.checkEmail(username, domain, tld).subscribe({
                next: (response) => {
                    this.router.navigate([Routes.login]);
                },
                error: (error) => {
                    console.error('Error al enviar el email:', error);
                }
            })
        }
    }
}
