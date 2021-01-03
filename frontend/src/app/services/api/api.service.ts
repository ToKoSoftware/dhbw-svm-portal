import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import isBlank from 'is-blank';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public static getApiBaseUrl(): string {
    return environment.apiUrl;
  }

  public static getJwt(): string | null {
    return localStorage.getItem('jwt');
  }

  constructor(
    private readonly http: HttpClient,
  ) {
  }

  public get<Data>(
    path: string,
    queryParams?: { [key: string]: string | string[] | number | undefined },
  ): Observable<ApiResponse<Data>> {
    const params = queryParams == null ?
      undefined : new HttpParams({
        fromObject: removeBlank(queryParams) as { [key: string]: string | string[] }
      });

    const jwt = ApiService.getJwt();
    return this.http.get(`${ApiService.getApiBaseUrl()}${path}`, {
      headers: {
        Authorization: jwt == null ? '' : `Bearer ${jwt}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params,
    }) as Observable<ApiResponse<Data>>;
  }

  public post<Data>(
    path: string,
    body?: { [key: string]: string | string[] | number | undefined},
  ): Observable<ApiResponse<Data>> {
    const jwt = ApiService.getJwt();

    return this.http.post(`${ApiService.getApiBaseUrl()}${path}`, JSON.stringify(body), {
      headers: {
        Authorization: jwt == null ? '' : `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    }) as Observable<ApiResponse<Data>>;
  }

  public put<Data>(
    path: string,
    body?: { [key: string]: string | string[] | undefined },
  ): Observable<ApiResponse<Data>> {
    const jwt = ApiService.getJwt();

    return this.http.put(`${ApiService.getApiBaseUrl()}${path}`, JSON.stringify(body), {
      headers: {
        Authorization: jwt == null ? '' : `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    }) as Observable<ApiResponse<Data>>;
  }

  public delete<Data = boolean>(
    path: string,
    queryParams?: { [key: string]: string | string[] | undefined },
  ): Observable<ApiResponse<Data>> {
    const params = queryParams == null ?
      undefined : new HttpParams({
        fromObject: removeBlank(queryParams) as { [key: string]: string | string[] }
      });

    const jwt = ApiService.getJwt();
    return this.http.delete(`${ApiService.getApiBaseUrl()}${path}`, {
      headers: {
        Authorization: jwt == null ? '' : `Bearer ${jwt}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params,
    }) as Observable<ApiResponse<Data>>;
  }

}

function removeBlank(
  input: { [key: string]: string | string[] | number | undefined }
): { [key: string]: string | string[] } {
  const result: { [key: string]: string | string[] } = {};
  for (const key in input) {
    if (isBlank(input[key])) {
      continue;
    }
    const element = input[key];
    if (Array.isArray(element)) {
      result[`${key}[]`] = element;
    } else {
      result[key] = element as string;
    }
  }
  return result;
}

export interface ApiResponse<Data> {
  success: true;
  data: Data;
  totalCount?: number;
}

export interface ApiError {
  success: false;
  error: string;
  statusCode?: number;
}
