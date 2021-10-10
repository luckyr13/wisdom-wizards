import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AboutComponent } from './about/about.component';
import { WhitepaperComponent } from './whitepaper/whitepaper.component';
import { AuthGuard } from './auth/auth.guard';
import { InitPlatformGuard } from './auth/init-platform.guard';

const routes: Routes = [
	{ path: 'home', component: HomeComponent, canActivate: [InitPlatformGuard] },
	{ 
		path: 'dashboard',
		component: DashboardComponent,
		canActivate: [AuthGuard, InitPlatformGuard]
	},
	{ path: 'about', component: AboutComponent, canActivate: [InitPlatformGuard] },
	{ path: 'whitepaper', component: WhitepaperComponent, canActivate: [InitPlatformGuard] },
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: '**', component: PageNotFoundComponent, canActivate: [InitPlatformGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
