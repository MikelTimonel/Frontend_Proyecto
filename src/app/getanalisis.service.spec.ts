import { TestBed } from '@angular/core/testing';

import { GetanalisisService } from './getanalisis.service';

describe('GetanalisisService', () => {
  let service: GetanalisisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetanalisisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
