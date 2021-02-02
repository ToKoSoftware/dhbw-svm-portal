import {Injectable} from '@angular/core';
import {CreateAndUpdateData, DataService, DataServiceFunctions} from '../data.service';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {PollAnswerData, PollData} from '../../../interfaces/poll.interface';

@Injectable({
  providedIn: 'root'
})
export class PollsService extends DataService<PollData> implements DataServiceFunctions<PollData> {

  reloadData() {
    this.data$.next(null);
    this.api.get<PollData[]>('/polls')
      .subscribe(
        data => this.data$.next(data.data),
        error => this.notifications.loadingFailed()
      );
  }

  create(PollData: CreateAndUpdateData<PollData>): Observable<PollData> {
    return this.api.post<PollData>(`/polls`, PollData)
      .pipe(map(res => {
        this.reloadData();
        return res.data;
      }));
  }

  delete(data: CreateAndUpdateData<PollData>): boolean {
    return false;
  }

  read(id: string): Observable<PollData> {
    return this.api.get<PollData>(`/polls/${id}`)
      .pipe(map(res => {
        return res.data;
      }));
  }

  update(PollData: CreateAndUpdateData<PollData>): Observable<PollData> {
    return this.api.put<PollData>(`/polls/${PollData.id}`)
      .pipe(map(res => {
        this.reloadData();
        return res.data;
      }));
  }

  createAnswer(poll: PollData, pollAnswerData: CreateAndUpdateData<PollAnswerData>) {
    this.reloadData();
    return this.api.post<PollData>(`/polls/${poll.id}/answer`, pollAnswerData)
      .pipe(map(res => {
        return res.data;
      }));
  }
}
