import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

import { checkToken } from '@interceptors/token.interceptor';
import { Card, CreateCardDto, UpdateCardDto } from '@models/card.model';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private http: HttpClient = inject(HttpClient);

  apiUrl = environment.API_URL;

  create(dto: CreateCardDto) {
    return this.http.post(`${this.apiUrl}/api/v1/cards`, dto, {
      context: checkToken(),
    });
  }

  update(id: Card['id'], changes: UpdateCardDto) {
    return this.http.put(`${this.apiUrl}/api/v1/cards/${id}`, changes, {
      context: checkToken(),
    });
  }
}
