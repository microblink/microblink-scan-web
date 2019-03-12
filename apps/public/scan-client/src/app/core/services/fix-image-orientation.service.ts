import { Injectable } from '@angular/core';
import { fixImageOrientation, IFixedImage } from '../helpers/imageOrientationHelper'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FixImageOrientationService {

  constructor() { }

  public getImageAsBase64FromFileWithFixedOrientation(image: File, resetBase64: boolean = false, maxDimension: number = 0): Observable<IFixedImage> {
    return Observable.create(observer => {
      fixImageOrientation(image, resetBase64, observer, maxDimension)
    })
  }

  
}
