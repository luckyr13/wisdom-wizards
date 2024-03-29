import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SubjectsRoutingModule } from './subjects-routing.module';
import { ListComponent } from './list/list.component';
import { ViewDetailComponent } from './view-detail/view-detail.component';


@NgModule({
  declarations: [
    ListComponent,
    ViewDetailComponent
  ],
  imports: [
    CommonModule,
    SubjectsRoutingModule,
    SharedModule
  ]
})
export class SubjectsModule { }
