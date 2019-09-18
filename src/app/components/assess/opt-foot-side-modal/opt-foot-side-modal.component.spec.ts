import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptFootSideModalComponent } from './opt-foot-side-modal.component';

describe('OptFootSideModalComponent', () => {
  let component: OptFootSideModalComponent;
  let fixture: ComponentFixture<OptFootSideModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptFootSideModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptFootSideModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
