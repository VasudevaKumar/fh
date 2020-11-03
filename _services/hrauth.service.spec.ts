import { TestBed } from '@angular/core/testing';

import { HrauthService } from './hrauth.service';

describe('HrauthService', () => {
  let service: HrauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
