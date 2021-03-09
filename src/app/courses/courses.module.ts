import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { ListComponent } from './list/list.component';


@NgModule({
  declarations: [ListComponent],
  imports: [
    CommonModule,
    CoursesRoutingModule
  ]
})
export class CoursesModule { }
