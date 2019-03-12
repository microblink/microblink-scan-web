import { Pipe, PipeTransform } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { Observable } from 'rxjs';

@Pipe({
  name: 'doc'
})
export class DocPipe implements PipeTransform {

  constructor(private db: FirestoreService) {}

  transform(value: any): Observable<any> {
    if (!value) return
    return this.db.doc$(value.path)
  }

}
