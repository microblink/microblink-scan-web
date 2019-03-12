import { Injectable } from '@angular/core';
import { blobQRCodeReader } from '../helpers/qrCodeHelper';
import { QRCode } from 'jsqr';

@Injectable({
  providedIn: 'root'
})
export class QRService {

  constructor() { }

  readBlob(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      blobQRCodeReader(blob).then((qrCodeData: QRCode) => {
        if (qrCodeData) {
          resolve(qrCodeData.data)
        } else {
          resolve(null)
        }
      }, reject)
    })
  }
}
