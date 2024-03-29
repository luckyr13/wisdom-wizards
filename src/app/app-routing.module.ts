import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AboutComponent } from './about/about.component';
import { WhitepaperComponent } from './whitepaper/whitepaper.component';
import { AuthGuard } from './auth/auth.guard';
import { InitPlatformGuard } from './auth/init-platform.guard';
import { LangRedirectComponent } from './lang-redirect/lang-redirect.component';

const routes: Routes = [
	{
		path: '', 
		component: LangRedirectComponent,
		pathMatch: 'full',
		canActivate: [InitPlatformGuard]
	},
	{
		path: ':lang',
		canActivate: [InitPlatformGuard],
		canActivateChild: [InitPlatformGuard],
		children: [
			{ path: 'home', component: HomeComponent },
			{ 
				path: 'dashboard',
				component: DashboardComponent,
				canActivate: [AuthGuard]
			},
			{ path: 'about', component: AboutComponent},
			{ path: 'whitepaper', component: WhitepaperComponent},
			{ path: '', redirectTo: 'home', pathMatch: 'full' },
			{ path: '**', component: PageNotFoundComponent },

		]
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
