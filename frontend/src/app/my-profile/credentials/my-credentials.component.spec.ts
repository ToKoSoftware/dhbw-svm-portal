import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCredentialsComponent } from './my-credentials.component';

describe('CredentialsComponent', () => {
  let component: MyCredentialsComponent;
  let fixture: ComponentFixture<MyCredentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCredentialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
