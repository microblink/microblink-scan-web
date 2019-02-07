import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ScanService } from '../../core/services/scan.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FixImageOrientationService } from '../../core/services/fix-image-orientation.service';

// TODO: refactor with Microblink NPM package when package will expose SDK module
declare var Microblink: any;

@Component({
  selector: 'microblink-scan-page',
  templateUrl: './scan-page.component.html',
  styleUrls: ['./scan-page.component.scss']
})
export class ScanPageComponent implements OnInit, OnDestroy {

  scan$: any;
  scanSubscription: Subscription

  // To this dimension preview image will be resized
  maxDimension: number = 0

  scanId: string;
  key: string;

  activatedRouteParams$: Subscription
  activatedRouteQueryParams$: Subscription

  @ViewChild('inputFileImage') inputFileImage: ElementRef;
  inputImageAsBase64: string = null;
  inputImageOrientation = 1;

  constructor(private scanService: ScanService, private activatedRoute: ActivatedRoute, private fixImageService: FixImageOrientationService) {

    // Read scanId (scan identificator) from URL param
    this.activatedRouteParams$ = activatedRoute.params.subscribe(params => {
      // console.log('activatedRoute.params', params)
      this.scanId = params.scanId   
    });

    // Read key (encryption key) from query param
    this.activatedRouteQueryParams$ = activatedRoute.queryParams.subscribe(queryParams => {
      // console.log('activatedRoute.queryParams', queryParams)
      this.key = queryParams.key
    });    

    Microblink.SDK.RegisterListener({
      onScanSuccess: (data: { result: any; }) => {
        // Encrypt fetched result
        this.scanService.saveResultToScan(this.scanId, data.result, this.key)
      },
      onScanError: (error: any) => {
        this.scanService.saveErrorToScan(this.scanId, error)
      }
    });
  }

  /**
   * On component initialization
   */
  ngOnInit() {
    // Get scan promise for template async access
    this.scan$ = this.scanService.getScanById(this.scanId)
    // Subscribe to the scan data
    this.scanSubscription = this.scanService.getScanById(this.scanId).subscribe((scanData: any) => {
      if (!scanData) return
      this.scanService.setupMicroblinkSDK(scanData, this.key)
    })    
    this.setMaxDimension(window.innerWidth, window.innerHeight)
  }

  /**
   * On component destory
   */
  ngOnDestroy(): void {
    this.activatedRouteParams$.unsubscribe()
    this.activatedRouteQueryParams$.unsubscribe()
    this.scanSubscription.unsubscribe()
  }

  /**
   * Open camera with programmatically triggered click to the <input type="file"...
   * NOTE: it is not possible to open camera on page load, only it is possible to trigger click
   * when user click anywhere in the page
   */
  openCamera() {

    if (this.inputFileImage == null) {
      return;
    }
    this.inputFileImage.nativeElement.click();
    this.scanService.openCamera(this.scanId)
  }

  /**
   * Upload selected image from camera to the Microblink API via Microblink SDK
   */
  upload() {

    if (this.inputFileImage == null) {
      return;
    }

    // Get File from the browsing dialog
    const fileList: FileList = this.inputFileImage.nativeElement.files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0]
      // Send first and only file from <input type="file"... from the camera (file dialog)
      this.scanService.sendImageToRecognition(this.scanId, file)

      // Change image's bytes depends on the orientation
      const resetBase64 = true
      // Preview taken image with corrected orientation
      this.fixImageService.getImageAsBase64FromFileWithFixedOrientation(file, resetBase64, this.maxDimension).subscribe(fixedImage => {
        this.inputImageOrientation = fixedImage.orientation     
        this.inputImageAsBase64 = fixedImage.src 
      });
    }
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const w = event.target.innerWidth;
    const h = event.target.innerHeight;

    this.setMaxDimension(w,h);
  }

  private setMaxDimension(w,h): void {
    if (w > h) {
      this.maxDimension = w
    } else {
      this.maxDimension = h
    }
  }

  
}
