import {Injectable} from '@angular/core';
import {CreateAndUpdateData, DataService, DataServiceFunctions} from '../data.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {PollAnswerData, PollData} from '../../../interfaces/poll.interface';

@Injectable({
  providedIn: 'root'
})
export class PollsService extends DataService<PollData> implements DataServiceFunctions<PollData> {

  reloadData() {
    this.data$.next(null);
    this.api.get<PollData[]>('/polls', {showExpired: 'true'})
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

  delete(data: PollData): Observable<unknown> {
    return this.api.delete<PollData>(`/polls/${data.id}`)
      .pipe(map(res => {
        this.reloadData();
        return res;
      }));
  }

  read(id: string): Observable<PollData> {
    return this.api.get<PollData>(`/polls/${id}`)
      .pipe(map(res => {
        return res.data;
      }));
  }

  update(updateData: CreateAndUpdateData<PollData>): Observable<PollData> {
    return this.api.put<PollData>(`/polls/${updateData.id}`, updateData)
      .pipe(map(res => {
        this.notifications.savedSuccessfully();
        this.reloadData();
        return res.data;
      }));
  }

  createAnswer(poll: PollData, pollAnswerData: CreateAndUpdateData<PollAnswerData>) {
    return this.api.post<PollData>(`/polls/${poll.id}/answers`, pollAnswerData)
      .pipe(map(res => {
        this.notifications.savedSuccessfully();
        this.reloadData();
        return res.data;
      }));
  }

  vote(poll: PollData, pollAnswer: {title: string, answer_id: string}) {
    return this.api.post<PollData>(`/polls/${poll.id}/${pollAnswer.answer_id}/vote`, {title: pollAnswer.title})
      .pipe(map(res => {
        this.notifications.savedSuccessfully();
        this.reloadData();
        return res.data;
      }));
  }

  updateAnswer(poll: PollData, pollAnswerData: CreateAndUpdateData<PollAnswerData>) {
    return this.api.put<PollData>(`/polls/${poll.id}/${pollAnswerData.id}`, pollAnswerData)
      .pipe(map(res => {
        this.notifications.savedSuccessfully();
        this.reloadData();
        return res.data;
      }));
  }

  deleteAnswer(poll: PollData, pollAnswerData: PollAnswerData) {
    return this.api.delete<PollData>(`/polls/${poll.id}/${pollAnswerData.id}`)
      .pipe(map(res => {
        this.notifications.deletedSuccessfully();
        this.reloadData();
        return res;
      }));
  }
}
