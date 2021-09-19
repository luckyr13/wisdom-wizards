import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ViewDetailComponent } from './view-detail/view-detail.component';
import { EditComponent } from './edit/edit.component';
import { NewComponent } from './new/new.component';
import { AuthGuard } from '../auth/auth.guard';
import { CreatedComponent } from './created/created.component';

const routes: Routes = [
	{ 
		path: 'learn',
		children: [
			{
				path: 'new',
				component: NewComponent,
				canActivate: [AuthGuard],
			},
			{
				path: 'created',
				component: CreatedComponent,
				canActivate: [AuthGuard],
			},
			{
				path: ':id',
				component: ViewDetailComponent
			},
			{
				path: ':id/edit',
				component: EditComponent,
				canActivate: [AuthGuard],
			},
			{
				path: '',
				component: ListComponent,
				pathMatch: 'full',
			}
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
