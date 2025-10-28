import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_PATH } from '../variables';
import { Configuration } from '../configuration';
import { BaseService } from '../api.base.service';

@Injectable({ providedIn: 'root' })
export class CartService extends BaseService {
  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string | string[],
    @Optional() configuration?: Configuration,
  ) {
    super(basePath, configuration);
  }

  /**
   * Crée un panier
   * POST /api/panier/create
   */
  public createPanier(body: {
    panierCode: string;
    clientCode: string;
    state: string;
  }): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/hal+json',
      'Content-Type': 'application/json',
    });
    return this.httpClient.post(`${this.configuration.basePath}/panier/create`, body, { headers });
  }

  /**
   * Ajoute un produit au panier
   * POST /api/panier/add-product
   */
  public addProductToPanier(
    panierCode: string,
    produitCode: string,
    quantite: number,
  ): Observable<any> {
    const headers = new HttpHeaders({ Accept: 'application/hal+json' });
    const params = new HttpParams()
      .set('panierCode', panierCode)
      .set('produitCode', produitCode)
      .set('quantite', quantite.toString());
    return this.httpClient.post(`${this.configuration.basePath}/panier/add-product`, null, {
      headers,
      params,
    });
  }

  /**
   * Récupère le panier par client
   * GET /api/panier/by-client
   */
  public getPanierByClient(clientCode: string): Observable<any> {
    const headers = new HttpHeaders({ Accept: 'application/hal+json' });
    const params = new HttpParams().set('clientCode', clientCode);
    return this.httpClient.get(`${this.configuration.basePath}/panier/by-client`, {
      headers,
      params,
    });
  }
}
