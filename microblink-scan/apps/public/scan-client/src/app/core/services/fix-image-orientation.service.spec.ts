import { TestBed } from '@angular/core/testing';

import { FixImageOrientationService } from './fix-image-orientation.service';

describe('FixImageOrientationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FixImageOrientationService = TestBed.get(FixImageOrientationService);
    expect(service).toBeTruthy();
  });
});
