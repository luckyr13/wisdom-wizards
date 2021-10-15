import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';

const routes: Routes = [{
	path: ':lang/student',
	children: [
		{
			path: 'courses',
			component: CoursesComponent
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
export class StudentRoutingModule { }
