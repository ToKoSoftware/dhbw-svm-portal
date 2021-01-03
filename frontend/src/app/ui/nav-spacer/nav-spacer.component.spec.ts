import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavSpacerComponent } from './nav-spacer.component';

describe('NavSpacerComponent', () => {
  let component: NavSpacerComponent;
  let fixture: ComponentFixture<NavSpacerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavSpacerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavSpacerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
