import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { fixImageOrientation } from '../helpers/imageOrientationHelper'

@Pipe({
  name: 'rotationCorrection'
})
export class RotationCorrectionPipe implements PipeTransform {

  private resetBase64 = false

  constructor() {}

  public transform(image: string | Blob, mode = ''): Observable<any> {

    if (mode === 'resetBase64') {
      this.resetBase64 = true
    }

    return Observable.create(observer => {

      if ((image as Blob).size) {
        fixImageOrientation(image as Blob, this.resetBase64, observer)
      } else {  
        var xhr = new XMLHttpRequest();
        xhr.open("GET", image as string);
        xhr.responseType = "blob";
        xhr.onload = (e) => {
          const imageAsBlob = e.currentTarget['response']  
          fixImageOrientation(imageAsBlob, this.resetBase64, observer)      
        };
        xhr.send();
      }
    })
  }

  
  

  
}