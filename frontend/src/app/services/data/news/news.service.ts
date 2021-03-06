import {Injectable} from '@angular/core';
import {CreateAndUpdateData, DataService, DataServiceFunctions} from '../data.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {NewsData} from '../../../interfaces/news.interface';

@Injectable({
  providedIn: 'root'
})
export class NewsService extends DataService<NewsData> implements DataServiceFunctions<NewsData> {

  reloadData() {
    this.data$.next(null);
    this.api.get<NewsData[]>('/news')
      .subscribe(
        data => this.data$.next(data.data),
        error => this.notifications.loadingFailed()
      );
  }

  create(NewsData: CreateAndUpdateData<NewsData>): Observable<NewsData> {
    return this.api.post<NewsData>(`/news`, NewsData)
      .pipe(map(res => {
        this.reloadData();
        return res.data;
      }));
  }

  delete(data: NewsData): Observable<unknown> {
    return this.api.delete<NewsData>(`/news/${data.id}`)
      .pipe(map(res => {
        this.reloadData();
        return res;
      }));
  }

  read(id: string): Observable<NewsData> {
    return this.api.get<NewsData>(`/news/${id}`)
      .pipe(map(res => {
        return res.data;
      }));
  }

  update(updateData: CreateAndUpdateData<NewsData>): Observable<NewsData> {
    return this.api.put<NewsData>(`/news/${updateData.id}`, updateData)
      .pipe(map(res => {
        this.reloadData();
        return res.data;
      }));
  }

}
