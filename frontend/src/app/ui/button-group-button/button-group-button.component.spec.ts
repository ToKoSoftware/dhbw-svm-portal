import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonGroupButtonComponent } from './button-group-button.component';

describe('ButtonGroupButtonComponent', () => {
  let component: ButtonGroupButtonComponent;
  let fixture: ComponentFixture<ButtonGroupButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonGroupButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonGroupButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
