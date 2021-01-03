import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLineStatsComponent } from './admin-line-stats.component';

describe('OrderStatsComponent', () => {
  let component: AdminLineStatsComponent;
  let fixture: ComponentFixture<AdminLineStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminLineStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLineStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
