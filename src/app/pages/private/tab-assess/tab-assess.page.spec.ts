import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabAssessPage } from './tab-assess.page';

describe('TabAssessPage', () => {
  let component: TabAssessPage;
  let fixture: ComponentFixture<TabAssessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabAssessPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabAssessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
