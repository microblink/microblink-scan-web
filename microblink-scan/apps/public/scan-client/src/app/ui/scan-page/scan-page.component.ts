import { Component, OnInit } from '@angular/core';
import { ScanService } from '../../core/services/scan.service';

@Component({
  selector: 'microblink-scan-page',
  templateUrl: './scan-page.component.html',
  styleUrls: ['./scan-page.component.scss']
})
export class ScanPageComponent implements OnInit {

  scan$: any;

  constructor(private scanService: ScanService) { }

  ngOnInit() {
    this.scan$ = this.scanService.getScanById('nekiScanId')
  }

}
