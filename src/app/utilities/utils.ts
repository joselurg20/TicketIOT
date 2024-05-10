import { FormControl } from "@angular/forms";
import { LocalStorageKeys } from "./literals";

export class Utils {

  /**
   * Da formato a la fecha.
   * @param fecha la fecha a formatear.
   * @returns la fecha con formato 'DD/MM/AAAA - HH:mm:ss'
   */
    public static formatDate(fecha: string): string {
        const fechaObj = new Date(fecha);
        const dia = fechaObj.getDate().toString().padStart(2, '0');
        const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0'); // Se suma 1 porque los meses van de 0 a 11
        const año = fechaObj.getFullYear();
        const horas = fechaObj.getHours().toString().padStart(2, '0');
        const minutos = fechaObj.getMinutes().toString().padStart(2, '0');
        const segundos = fechaObj.getSeconds().toString().padStart(2, '0');
    
        return `${dia}/${mes}/${año} - ${horas}:${minutos}:${segundos}`;
    }

    /**
   * Obtiene el texto a representar en función de la prioridad y el idioma.
   * @param priority la prioridad.
   * @returns la cadena de texto a representar.
   */
  public static getPriorityString(priority: number): string {
    if(localStorage.getItem(LocalStorageKeys.selectedLanguage) == 'en') {
      switch (priority) {
        case 1:
          return 'LOWEST';
        case 2:
          return 'LOW';
        case 3:
          return 'MEDIUM';
        case 4:
          return 'HIGH';
        case 5:
          return 'HIGHEST';
        default:
          return 'NOT SURE';
      }
    } else if (localStorage.getItem(LocalStorageKeys.selectedLanguage) == 'es') {
      switch (priority) {
        case 1:
          return 'MUY BAJA';
        case 2:
          return 'BAJA';
        case 3:
          return 'MEDIA';
        case 4:
          return 'ALTA';
        case 5:
          return 'MUY ALTA';
        default:
          return 'INDEFINIDA';
      }
    }
    return '';
  }

  /**
   * Obtiene el texto a representar en función del estado y el idioma.
   * @param status el estado.
   * @returns la cadena de texto a representar.
   */
  public static getStatusString(status: number): string {
    if(localStorage.getItem(LocalStorageKeys.selectedLanguage) == 'en') {
      switch (status) {
        case 1:
          return 'OPENED';
        case 2:
          return 'PAUSED';
        case 3:
          return 'FINISHED';
        default:
          return 'PENDING';
      }
    } else if (localStorage.getItem(LocalStorageKeys.selectedLanguage) == 'es') {
      switch (status) {
        case 1:
          return 'ABIERTA';
        case 2:
          return 'PAUSADA';
        case 3:
          return 'TERMINADA';
        default:
          return 'PENDIENTE';
      }
    }
    return '';
  }
}