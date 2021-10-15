import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { AuthGuard } from '../auth/auth.guard';
import { InitPlatformGuard } from '../auth/init-platform.guard';

const routes: Routes = [{
	path: ':lang/instructor',
	canActivate: [InitPlatformGuard],
	canActivateChild: [InitPlatformGuard, AuthGuard],
	children: [
		{
			path: 'courses',
			component: CoursesComponent
		},
		{
			path: 'create-course',
			component: CreateCourseComponent
		},
		{
			path: '',
			pathMatch: 'full',
			redirectTo: 'courses'
		}		
	]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorRoutingModule { }
