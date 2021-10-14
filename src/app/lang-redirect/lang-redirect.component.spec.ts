import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangRedirectComponent } from './lang-redirect.component';

describe('LangRedirectComponent', () => {
  let component: LangRedirectComponent;
  let fixture: ComponentFixture<LangRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LangRedirectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LangRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
