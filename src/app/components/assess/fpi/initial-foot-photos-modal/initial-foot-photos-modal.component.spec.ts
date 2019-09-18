import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialFootPhotosModalComponent } from './initial-foot-photos-modal.component';

describe('InitialFootPhotosModalComponent', () => {
  let component: InitialFootPhotosModalComponent;
  let fixture: ComponentFixture<InitialFootPhotosModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialFootPhotosModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialFootPhotosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
