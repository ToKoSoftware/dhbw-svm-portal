import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import isBlank from 'is-blank';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private readonly http: HttpClient,
  ) {
  }

  public static getApiBaseUrl(version = 2): string {
    return `${environment.apiUrl}/v${version}`;
  }

  public static getPath(path: string | [string, number]): string {
    if (Array.isArray(path)) {
      return `${ApiService.getApiBaseUrl(path[1])}${path[0]}`;
    } else {
      return `${ApiService.getApiBaseUrl()}${path}`;
    }
  }

  public static getJwt(): string | null {
    return localStorage.getItem('jwt');
  }

  public get<Data>(
    path: string | [string, number],
    queryParams?: { [key: string]: string | string[] | number | null | undefined },
  ): Observable<ApiResponse<Data>> {
    const params = queryParams == null ?
      undefined : new HttpParams({
        fromObject: removeBlank(queryParams) as { [key: string]: string | string[] }
      });
    const jwt = ApiService.getJwt();
    return this.http.get(ApiService.getPath(path), {
      headers: {
        Authorization: jwt == null ? '' : `Bearer ${jwt}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params,
    }) as Observable<ApiResponse<Data>>;
  }

  public post<Data>(
    path: string | [string, number],
    body?: { [key: string]: string | string[] | number | null | undefined },
  ): Observable<ApiResponse<Data>> {
    const jwt = ApiService.getJwt();

    return this.http.post(ApiService.getPath(path), JSON.stringify(body), {
      headers: {
        Authorization: jwt == null ? '' : `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    }) as Observable<ApiResponse<Data>>;
  }

  public put<Data>(
    path: string | [string, number],
    body?: { [key: string]: string | string[] | number | null | undefined },
  ): Observable<ApiResponse<Data>> {
    const jwt = ApiService.getJwt();

    return this.http.put(ApiService.getPath(path), JSON.stringify(body), {
      headers: {
        Authorization: jwt == null ? '' : `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    }) as Observable<ApiResponse<Data>>;
  }

  public delete<Data = boolean>(
    path: string | [string, number],
    body?: { [key: string]: string | string[] | number | null | undefined },
  ): Observable<ApiResponse<Data>> {
    const jwt = ApiService.getJwt();
    const options = {
      headers: {
        Authorization: jwt == null ? '' : `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body,
    };
    return this.http.delete(ApiService.getPath(path), options) as Observable<ApiResponse<Data>>;
  }

}

function removeBlank(
  input: { [key: string]: string | string[] | number | null | undefined }
): { [key: string]: string | string[] } {
  const result: { [key: string]: string | string[] } = {};
  for (const key in input) {
    if (input[key] === null) {
      continue;
    }
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
