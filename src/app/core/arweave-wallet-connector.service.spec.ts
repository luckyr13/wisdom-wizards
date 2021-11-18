import { TestBed } from '@angular/core/testing';

import { ArweaveWalletConnectorService } from './arweave-wallet-connector.service';

describe('ArweaveWalletConnectorService', () => {
  let service: ArweaveWalletConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArweaveWalletConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
