import { Injectable } from '@angular/core';
import * as uuid from 'uuid/v4';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

// TODO: refactor with Microblink NPM package when package will expose SDK module
declare var Microblink: any;

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: AngularFireStorage) {}

  async upload(cryptedResult: any): Promise<any> {
    let that = this;
    return new Promise(function(resolve, reject) {
      const fileRef = that.storage.ref(uuid());
      const blob = that.base64toBlob(cryptedResult, 'application/octet-stream');
      let task = fileRef.put(blob);
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            resolve(url);
          });
        })
      )
      .subscribe();
    });
  }

  private base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

}
