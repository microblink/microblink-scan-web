import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocPipe } from './pipes/doc.pipe';

@NgModule({
  declarations: [
    DocPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DocPipe
  ]
})
export class CoreModule { }
