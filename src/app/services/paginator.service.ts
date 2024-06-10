import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomMatPaginatorIntl extends MatPaginatorIntl {

    itemsPerPageLabelEs = 'Incidencias por página: ';
    itemsPerPageLabelEn = 'Tickets per page: ';
    nextPageLabelEs     = 'Página siguiente';
    nextPageLabelEn     = 'Next page';
    previousPageLabelEs = 'Página anterior';
    previousPageLabelEn = 'Previous page';
    firstPageLabelEs    = 'Primera página';
    firstPageLabelEn    = 'First page';
    lastPageLabelEs     = 'Última página';
    lastPageLabelEn     = 'Last page';
    override itemsPerPageLabel: string = this.getItemsPerPageLabel();
    override nextPageLabel: string = this.getNextPageLabel();
    override previousPageLabel: string = this.getPreviousPageLabel();
    override firstPageLabel: string = this.getFirstPageLabel();
    override lastPageLabel: string = this.getLastPageLabel();

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
        if(localStorage.getItem('selectedLanguage') === 'es') {
            return `0 de ${length}`;
        } else{
            return `0 of ${length}`;
        }
    }
    const totalPages = Math.ceil(length / pageSize);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    if(localStorage.getItem('selectedLanguage') === 'es') {
        return `${startIndex + 1} - ${endIndex} de ${length}`;
    } else{
        return `${startIndex + 1} - ${endIndex} of ${length}`;
    }
  }


  getItemsPerPageLabel() {
    if(localStorage.getItem('selectedLanguage') === 'es') {
        return this.itemsPerPageLabelEs;
    }else{
        return this.itemsPerPageLabelEn;
    }
  }

  getNextPageLabel() {
    if(localStorage.getItem('selectedLanguage') === 'es') {
        return this.nextPageLabelEs;
    }else{
        return this.nextPageLabelEn;
    }
  }

  getPreviousPageLabel() {
    if(localStorage.getItem('selectedLanguage') === 'es') {
        return this.previousPageLabelEs;
    }else{
        return this.previousPageLabelEn;
    }
  }

  getFirstPageLabel() {
    if(localStorage.getItem('selectedLanguage') === 'es') {
        return this.firstPageLabelEs;
    }else{
        return this.firstPageLabelEn;
    }
  }

  getLastPageLabel() {
    if(localStorage.getItem('selectedLanguage') === 'es') {
        return this.lastPageLabelEs;
    }else{
        return this.lastPageLabelEn;
    }
  }

  switchLanguage() {
    this.getItemsPerPageLabel();
    this.getNextPageLabel();
    this.getPreviousPageLabel();
    this.getFirstPageLabel();
    this.getLastPageLabel();
    this.getRangeLabel = this.getRangeLabel;
  }
}
