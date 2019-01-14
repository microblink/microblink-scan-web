import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScanPageComponent } from './scan-page/scan-page.component';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';

@NgModule({
  declarations: [
    ScanPageComponent,
    HomePageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ScanPageComponent
  ]
})
export class UiModule { }
