import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { SharedModule } from './shared/shared.module';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { AboutComponent } from './about/about.component';
import { CoursesModule } from './courses/courses.module';
import { WhitepaperComponent } from './whitepaper/whitepaper.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    MainToolbarComponent,
    HomeComponent,
    PageNotFoundComponent,
    DashboardComponent,
    MainMenuComponent,
    AboutComponent,
    WhitepaperComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    CoursesModule,
    SharedModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
