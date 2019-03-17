import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AthletesPage } from './athletes.page';

describe('AthletesPage', () => {
  let component: AthletesPage;
  let fixture: ComponentFixture<AthletesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AthletesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AthletesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
