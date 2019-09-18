import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptMethodModalComponent } from './opt-method-modal.component';

describe('OptMethodModalComponent', () => {
  let component: OptMethodModalComponent;
  let fixture: ComponentFixture<OptMethodModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptMethodModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptMethodModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
