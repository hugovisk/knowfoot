import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessPage } from './assess.page';

describe('AssessPage', () => {
  let component: AssessPage;
  let fixture: ComponentFixture<AssessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
