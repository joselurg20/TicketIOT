import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();

  constructor() { }

  /**
   * Muestra el loading
   */
  showLoading() {
    if(!this._loading.value){
      this._loading.next(true);
    }
  }

  /**
   * Oculta el loading
   */
  hideLoading() {
    this._loading.next(false);
  }
}
