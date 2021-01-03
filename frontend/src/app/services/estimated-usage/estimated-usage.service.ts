import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EstimatedUsageService {

  constructor() {
  }

  public getEstimatedUsage(peopleCount: number): number | null {
    if (peopleCount <= 0) {
      return null;
    }

    // source https://strom-report.de/stromverbrauch/
    switch (peopleCount) {
      case 1:
        return 1600;
      case 2:
        return 2400;
      case 3:
        return 3200;
      case 4:
        return 4000;
      case 5:
        return 4500;
      default:
        // use linear regression to estimate the usage
        return 1600 + peopleCount * 2900 / 5;
    }
  }
}
