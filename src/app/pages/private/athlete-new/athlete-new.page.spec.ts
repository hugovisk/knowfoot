import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteNewPage } from './athlete-new.page';

describe('AthleteNewPage', () => {
  let component: AthleteNewPage;
  let fixture: ComponentFixture<AthleteNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteNewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
