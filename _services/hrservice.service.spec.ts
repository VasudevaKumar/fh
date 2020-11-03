import { TestBed } from '@angular/core/testing';

import { HrserviceService } from './hrservice.service';

describe('HrserviceService', () => {
  let service: HrserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HrserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
