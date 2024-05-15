import { Injectable } from '@angular/core';
import { filter, Observable, Subject } from 'rxjs';
import { AlertsDto, AlertType } from '../../models/shared/AlertDto';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  private subject = new Subject<AlertsDto>();
  private defaultId = "default-alert";

  onAlert(id = this.defaultId): Observable<AlertsDto> {
    return this.subject.asObservable().pipe(filter(x => x && x.id === id));
  }

  // convenience methods
  success(message: string, options?: any) {
    options.autoClose = true;
    options.color = "#30B177";
    this.alert(new AlertsDto({ ...options, type: AlertType.Success, message }));
  }

  error(message: string, options?: any) {
    options.color = "#fd6262";
    this.alert(new AlertsDto({ ...options, type: AlertType.Error, message }));
  }

  info(message: string, options?: any) {
    options.color = "#185b8e";
    this.alert(new AlertsDto({ ...options, type: AlertType.Info, message }));
  }

  warn(message: string, options?: any) {
    options.color = "#fdb83f";
    this.alert(new AlertsDto({ ...options, type: AlertType.Warning, message }));
  }

  // main alert method    
  alert(alert: AlertsDto) {
    alert.id = alert.id || this.defaultId;
    this.subject.next(alert);
  }

  // clear alerts
  clear(id = this.defaultId) {
    this.subject.next(new AlertsDto({ id }));
  }
}
