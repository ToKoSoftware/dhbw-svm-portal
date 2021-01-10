import { TestBed } from '@angular/core/testing';

import { TitleBarService } from './title-bar.service';

describe('TitleBarService', () => {
  let service: TitleBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TitleBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
