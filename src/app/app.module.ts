import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IncidenceTicketsComponent } from "./components/incidences/incidence-tickets/incidence-tickets.component";
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { SnackbarIncidenceComponent } from './components/snackbars/snackbar-incidence/snackbar-incidence.component';
import { SnackbarMenssageComponent } from './components/snackbars/snackbar-menssage/snackbar-menssage.component';
import { SnackbarPasswordComponent } from './components/snackbars/snackbar-password/snackbar-password.component';
import { SnackbarRecoveredComponent } from './components/snackbars/snackbar-recovered/snackbar-recovered.component';


@NgModule({
    declarations: [
        AppComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        SnackbarIncidenceComponent, 
        SnackbarMenssageComponent, 
        SnackbarPasswordComponent, 
        SnackbarRecoveredComponent,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FontAwesomeModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpBackend]
            }
        }),
        IncidenceTicketsComponent,
        SidebarComponent
    ]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpBackend) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: "./assets/i18n/comunication/", suffix: ".json" },
        { prefix: "./assets/i18n/data/", suffix: ".json" },
        { prefix: "./assets/i18n/error/", suffix: ".json" },
        { prefix: "./assets/i18n/history/", suffix: ".json" },
        { prefix: "./assets/i18n/incidence-data/", suffix: ".json" },
        { prefix: "./assets/i18n/incidence-index/", suffix: ".json" },
        { prefix: "./assets/i18n/incidence-table/", suffix: ".json" },
        { prefix: "./assets/i18n/login/", suffix: ".json" },
        { prefix: "./assets/i18n/menssages/", suffix: ".json" },
        { prefix: "./assets/i18n/recovered/", suffix: ".json" },
        { prefix: "./assets/i18n/sidenav/", suffix: ".json" },
        { prefix: "./assets/i18n/snackbars/", suffix: ".json" },
        { prefix: "./assets/i18n/technical-table/", suffix: ".json" },
        { prefix: "./assets/i18n/test/", suffix: ".json" }
    ]);
}
