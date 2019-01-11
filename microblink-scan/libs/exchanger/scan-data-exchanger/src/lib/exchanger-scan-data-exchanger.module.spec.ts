import { async, TestBed } from '@angular/core/testing';
import { ExchangerScanDataExchangerModule } from './exchanger-scan-data-exchanger.module';

describe('ExchangerScanDataExchangerModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ExchangerScanDataExchangerModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ExchangerScanDataExchangerModule).toBeDefined();
  });
});
