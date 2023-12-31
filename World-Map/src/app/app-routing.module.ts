import { MapComponent } from './map/map.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {path: '', component: MapComponent},
  {path: 'home', redirectTo: ''},
  {path: 'about', component: AboutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
