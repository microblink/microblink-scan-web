import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';

// TODO: refactor with Microblink NPM package when package will expose SDK module
declare var Microblink: any;

@Injectable({
  providedIn: 'root'
})
export class ScanService {

  private basePath: string = 'scan'

  constructor(private firestore: FirestoreService) {

  }

  /**
   * Get scan object from Firestore by ID
   * @param scanId is scan object UID
   */
  getScanById(scanId: string) {
    return this.firestore.doc$(`${this.basePath}/${scanId}`)
  }  

  /**
   * Setup Microblink SDK with exchanged config (recognizers and authorizationHeader)
   * @param scanData is scan object
   * @param key is secret key for crypto operations
   */
  async setupMicroblinkSDK(scanData: any, key: string) {
    // Setup Microblink SDK from exchanged config
    Microblink.SDK.SetRecognizers(scanData.recognizers)
    Microblink.SDK.SetAuthorization(Microblink.SDK.Decrypt(scanData.authorizationHeader, key))
    // This check is protector to avoid updating in the loop
    if (scanData.status === Microblink.SDK.ScanExchangerCodes.Step02_ExchangeLinkIsGenerated) {
      // Persist scan.status
      await this.updateScan(scanData.scanId, { 
        // Change status
        status: Microblink.SDK.ScanExchangerCodes.Step03_RemoteCameraIsPending
      })
    }
  }

  async openCamera(scanId: string) {
    await this.updateScan(scanId, { 
      // Change status
      status: Microblink.SDK.ScanExchangerCodes.Step04_RemoteCameraIsOpen
    })
  }

  /**
   * Send image to Microblink API over Microblink SAK
   * @param file 
   */
  async sendImageToRecognition(scanId: string, file: File) {
    Microblink.SDK.SendImage({ blob: file })
    await this.updateScan(scanId, { 
      // Change status
      status: Microblink.SDK.ScanExchangerCodes.Step05_ImageIsUploading
    })
  }

  /**
   * Store OCR result to the scan object
   * @param scanId is can object UID
   * @param result is Microblink API response
   * @param key is crypto key with which data will be protected
   */
  async saveResultToScan(scanId: string, result: any, key: string) {
    // Protect data
    const cryptedResult = Microblink.SDK.Encrypt(result, key)
    // Persist protected data
    await this.updateScan(scanId, { 
      // Change status
      status: Microblink.SDK.ScanExchangerCodes.Step07_ResultIsAvailable,
      // Add crypted result
      result: cryptedResult,
      // Remove shortLink for security reasons
      shortLink: null 
    })
  }

  async saveErrorToScan(scanId: string, error) {
    // Persist protected data
    await this.updateScan(scanId, { 
      // Change status
      status: Microblink.SDK.ScanExchangerCodes.ErrorHappened,
      // Add error data
      error: error
    })
  }

  /**
   * Update scan object in Firestore
   * @param scanId is scan identificator
   * @param data is object with properties which will be updated in scan object
   */
  updateScan(scanId, data) {
    return this.firestore.update(`${this.basePath}/${scanId}`, data)
  }

}
