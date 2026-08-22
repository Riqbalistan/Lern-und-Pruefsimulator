import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Catalog } from '../models/catalog';

@Service()
export class CatalogService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5110/api/Catalogs';

  getCatalogs(): Observable<Catalog[]> {
    return this.http.get<Catalog[]>(this.apiUrl);
  }
}