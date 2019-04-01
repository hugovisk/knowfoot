import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthleteDetailPage } from './athlete-detail.page';

describe('AthleteDetailPage', () => {
  let component: AthleteDetailPage;
  let fixture: ComponentFixture<AthleteDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthleteDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
