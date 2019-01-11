import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NxModule } from '@nrwl/nx';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// Firestarter App Modules
import { CoreModule } from './core/core.module';
import { UiModule } from './ui/ui.module';

// @angular/fire/ Modules
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { AngularFireStorageModule } from '@angular/fire/storage';
// import { AngularFireAuthModule } from '@angular/fire/auth';
// import { AngularFireFunctionsModule } from '@angular/fire/functions';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NxModule.forRoot(),
    RouterModule.forRoot([], { 
      initialNavigation: 'enabled' 
    }),
    CoreModule,
    UiModule,
    AngularFireModule.initializeApp(environment.firebase, 'microblink-scan'),
    AngularFirestoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', { 
      enabled: environment.production 
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
