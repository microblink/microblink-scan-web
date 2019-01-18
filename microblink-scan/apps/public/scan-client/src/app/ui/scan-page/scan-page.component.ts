import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ScanService } from '../../core/services/scan.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

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

  scanId: string;
  key: string;

  activatedRouteParams$: Subscription
  activatedRouteQueryParams$: Subscription

  @ViewChild('inputFileImage') inputFileImage: ElementRef;
  inputImageAsBase64: string = null;


  constructor(private scanService: ScanService, private activatedRoute: ActivatedRoute) {

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
      onScanSuccess: (data) => {
        // Encrypt fetched result
        this.scanService.saveResultToScan(this.scanId, data.result, this.key)
      }
      // ,
      // onScanError: (error) => {
      //   console.error('Microblink.SDK.error', error);
      // }
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

    const fileList: FileList = this.inputFileImage.nativeElement.files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0]
      // Send first and only file from <input type="file"... from the camera (file dialog)
      this.scanService.sendImageToRecognition(this.scanId, file)

      // Preview taken image
      this.fileToBase64(fileList[0]).then((result: string) => {
        this.inputImageAsBase64 = result;
      }, (err: any) => {
        // Ignore error, do nothing
        this.inputImageAsBase64 = null;
      });
    }
  }


  /**
   * Convert file as blob to the base64 string
   * @param fileImage is File object
   */
  private fileToBase64(fileImage: File): Promise<{}> {
    return new Promise((resolve, reject) => {
      let fileReader: FileReader = new FileReader();
      if (fileReader && fileImage != null) {
        fileReader.readAsDataURL(fileImage);
        fileReader.onload = () => {
          resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      } else {
        reject(new Error('No file found'));
      }
    });
  }

  
}
