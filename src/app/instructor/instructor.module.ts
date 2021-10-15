import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { InstructorRoutingModule } from './instructor-routing.module';
import { CoursesComponent } from './courses/courses.component';
import { CreateCourseComponent } from './create-course/create-course.component';


@NgModule({
  declarations: [
    CoursesComponent,
    CreateCourseComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InstructorRoutingModule
  ]
})
export class InstructorModule { }
