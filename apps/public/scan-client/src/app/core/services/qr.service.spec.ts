import { TestBed } from '@angular/core/testing';

import { QRService } from './qr.service';

describe('QRService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QRService = TestBed.get(QRService);
    expect(service).toBeTruthy();
  });
});
