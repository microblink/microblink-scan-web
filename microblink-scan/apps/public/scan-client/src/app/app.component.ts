import { Component } from '@angular/core';

import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'

interface AppState {
  message: string
}


@Component({
  selector: 'microblink-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'public-scan-client';

  message$: Observable<string>;

  constructor(private store: Store<AppState>) {
    this.message$ = this.store.select('message')
  }

  spanishMessage() {
    this.store.dispatch({ type: 'SPANISH' })
  }

  frenchMessage() {
    this.store.dispatch({ type: 'FRENCH' })
  }
}
