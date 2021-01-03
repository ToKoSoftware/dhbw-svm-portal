import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPieStatsComponent } from './admin-pie-stats.component';

describe('AdminPieStatsComponent', () => {
  let component: AdminPieStatsComponent;
  let fixture: ComponentFixture<AdminPieStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPieStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPieStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
