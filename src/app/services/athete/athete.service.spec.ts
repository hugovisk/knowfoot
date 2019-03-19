import { TestBed } from '@angular/core/testing';

import { AtheteService } from './athete.service';

describe('AtheteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AtheteService = TestBed.get(AtheteService);
    expect(service).toBeTruthy();
  });
});
