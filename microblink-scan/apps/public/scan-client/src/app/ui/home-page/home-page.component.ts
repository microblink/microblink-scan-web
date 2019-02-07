import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { QRService } from '../../core/services/qr.service';

@Component({
  selector: 'microblink-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  @ViewChild('inputFileImage') inputFileImage: ElementRef
  @ViewChild('linkToGo') linkToGo: ElementRef
  
  urlToOpen: string
  isQRCodeReading = false
  isQRCodeNotFound = false

  constructor(private QR: QRService) { }

  ngOnInit() {
  }

  /**
   * Read QR code from the taken image from the camera
   */
  qrCodeRead() {
    if (this.inputFileImage == null) {
      return;
    }

    // Get File from the browsing dialog
    const fileList: FileList = this.inputFileImage.nativeElement.files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0]

      this.isQRCodeReading = true
      this.isQRCodeNotFound = false
      this.urlToOpen = ''

      // Try to find and read QR code from the taken image from the input file (native camera on the smartphone)
      this.QR.readBlob(file).then(qrCodeData => {

        this.isQRCodeReading = false

        // If QR code data starts with 'http' then try to open this link
        if (qrCodeData.startsWith('http')) {
          
          this.urlToOpen = qrCodeData
          window.open(qrCodeData, "_self")

        } else {
          this.isQRCodeNotFound = true
        }
      }, error => {
        this.isQRCodeNotFound = true
        this.isQRCodeReading = false
      })
    }
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
  }

  

}
