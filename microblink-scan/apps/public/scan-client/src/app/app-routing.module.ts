import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ScanPageComponent } from './ui/scan-page/scan-page.component';
import { HomePageComponent } from './ui/home-page/home-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: ':scanId', component: ScanPageComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { 
      initialNavigation: 'enabled' 
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
