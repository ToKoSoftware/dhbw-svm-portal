import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReferrerStatsComponent } from './admin-referrer-stats.component';

describe('AdminReferrerStatsComponent', () => {
  let component: AdminReferrerStatsComponent;
  let fixture: ComponentFixture<AdminReferrerStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminReferrerStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReferrerStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
