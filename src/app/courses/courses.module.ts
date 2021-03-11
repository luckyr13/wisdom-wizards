import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CoursesRoutingModule } from './courses-routing.module';
import { ListComponent } from './list/list.component';
import { ViewDetailComponent } from './view-detail/view-detail.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { CreatedComponent } from './created/created.component';


@NgModule({
  declarations: [ListComponent, ViewDetailComponent, NewComponent, EditComponent, CreatedComponent],
  imports: [
    CommonModule,
    SharedModule,
    CoursesRoutingModule
  ]
})
export class CoursesModule { }
