import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocPipe } from './pipes/doc.pipe';
import { RotationCorrectionPipe } from './pipes/rotation-correction.pipe';

@NgModule({
  declarations: [
    DocPipe,
    RotationCorrectionPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DocPipe,
    RotationCorrectionPipe
  ]
})
export class CoreModule { }
