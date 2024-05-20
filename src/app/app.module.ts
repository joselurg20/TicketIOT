import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { registerLocaleData } from '@angular/common';
import { HttpBackend, HttpClientModule } from '@angular/common/http';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { enGB, es } from 'date-fns/locale';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { SnackbarIncidenceComponent } from './components/snackbars/snackbar-incidence/snackbar-incidence.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

registerLocaleData(es, 'es');
registerLocaleData(enGB, 'en');

@NgModule({
    declarations: [
        AppComponent
    ],
    providers: [
        {
            provide: MAT_DATE_LOCALE,
            useValue: [es , enGB]
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: [es , enGB]
        }
    ],
    bootstrap: [AppComponent],
    imports: [
        
        MatSnackBarModule,
        SnackbarIncidenceComponent,
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
