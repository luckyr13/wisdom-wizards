import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLoginOptionsComponent } from './modal-login-options.component';

describe('ModalLoginOptionsComponent', () => {
  let component: ModalLoginOptionsComponent;
  let fixture: ComponentFixture<ModalLoginOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalLoginOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLoginOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
