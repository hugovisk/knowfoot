import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessFpiPage } from './assess-fpi.page';

describe('AssessFpiPage', () => {
  let component: AssessFpiPage;
  let fixture: ComponentFixture<AssessFpiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessFpiPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessFpiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
