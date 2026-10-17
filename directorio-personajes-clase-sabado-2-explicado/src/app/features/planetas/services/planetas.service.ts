import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { API_URL } from '@core/config/api';
import { Pagina, unaSolaPagina } from '@shared/models/pagina.model';
import { Planeta } from '../../personajes/models/personaje.model';

@Injectable({ providedIn: 'root' })
export class PlanetasService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/planets`;
  private readonly porPagina = 12;

  buscar(pagina: number): Observable<Pagina<Planeta>> {
    const params = new HttpParams().set('page', pagina).set('limit', this.porPagina);

    return this.http.get<Pagina<Planeta> | Planeta[]>(this.url, { params }).pipe(
      map(mapearPagina),
      catchError((err: HttpErrorResponse) =>
        err.status === 404 ? of(unaSolaPagina<Planeta>([])) : throwError(() => err),
      ),
    );
  }
}

function mapearPagina(respuesta: Pagina<Planeta> | Planeta[]): Pagina<Planeta> {
  return Array.isArray(respuesta) ? unaSolaPagina(respuesta) : respuesta;
}
