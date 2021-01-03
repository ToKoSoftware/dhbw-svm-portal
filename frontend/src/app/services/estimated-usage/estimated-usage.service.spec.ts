import { TestBed } from '@angular/core/testing';

import { EstimatedUsageService } from './estimated-usage.service';

describe('EstimatedUsageServiceService', () => {
  let service: EstimatedUsageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstimatedUsageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
