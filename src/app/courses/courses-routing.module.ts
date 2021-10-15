import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ViewDetailComponent } from './view-detail/view-detail.component';
import { EditComponent } from './edit/edit.component';
import { AuthGuard } from '../auth/auth.guard';
import { InitPlatformGuard } from '../auth/init-platform.guard';

const routes: Routes = [
	{ 
		path: ':lang/learn',
		canActivate: [InitPlatformGuard],
		canActivateChild: [InitPlatformGuard],
		children: [
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
