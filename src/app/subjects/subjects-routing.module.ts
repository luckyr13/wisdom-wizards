import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitPlatformGuard } from '../auth/init-platform.guard';
import { ListComponent } from './list/list.component';
import { ViewDetailComponent } from './view-detail/view-detail.component';

const routes: Routes = [
	{
		path: ':lang/browse',
		canActivateChild: [InitPlatformGuard],
		children: [
			{
				path: ':slug',
				component: ViewDetailComponent
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
export class SubjectsRoutingModule { }
