import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrettyJsonModule } from 'angular2-prettyjson';
import { ScanPageComponent } from './scan-page/scan-page.component';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { CoreModule } from '../core/core.module';
import { NgProgressModule } from '@ngx-progressbar/core';

@NgModule({
  declarations: [
    ScanPageComponent,
    HomePageComponent,
  ],
  imports: [
    CommonModule,
    PrettyJsonModule,
    RouterModule,
    CoreModule,
    NgProgressModule
  ],
  exports: [
    ScanPageComponent
  ]
})
export class UiModule { }
