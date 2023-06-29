import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

import { List, CreateListDto } from '@models/list.model';

import { checkToken } from '@interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class ListsService {
  private http: HttpClient = inject(HttpClient);

  apiUrl = environment.API_URL;

  create(dto: CreateListDto) {
    return this.http.post<List>(`${this.apiUrl}/api/v1/lists`, dto, { context: checkToken() });
  }
}
