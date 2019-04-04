import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteModalPage } from './athlete-modal.page';

describe('AthleteModalPage', () => {
  let component: AthleteModalPage;
  let fixture: ComponentFixture<AthleteModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
