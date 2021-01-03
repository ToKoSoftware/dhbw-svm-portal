import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeroDataComponent } from './zero-data.component';

describe('ZeroDataComponent', () => {
  let component: ZeroDataComponent;
  let fixture: ComponentFixture<ZeroDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZeroDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZeroDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
