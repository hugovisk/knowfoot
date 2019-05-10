import { TestBed } from '@angular/core/testing';

import { AssessFpiService } from './assess-fpi.service';

describe('AssessFpiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssessFpiService = TestBed.get(AssessFpiService);
    expect(service).toBeTruthy();
  });
});
