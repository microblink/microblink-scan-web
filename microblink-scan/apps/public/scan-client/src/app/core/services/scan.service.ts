import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class ScanService {

  private basePath: string = 'scan'

  constructor(private firestore: FirestoreService) {

  }

  getScanById(scanId: string) {
    return this.firestore.doc$(`${this.basePath}/${scanId}`)
  }
}
