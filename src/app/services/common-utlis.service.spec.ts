import { TestBed } from '@angular/core/testing';

import { CommonUtlisService } from './common-utlis.service';

describe('CommonUtlisService', () => {
  let service: CommonUtlisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonUtlisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
