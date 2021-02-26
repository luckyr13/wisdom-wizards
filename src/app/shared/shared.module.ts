import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { ModalLoginOptionsComponent } from './modal-login-options/modal-login-options.component';
import {MatListModule} from '@angular/material/list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressBarModule} from '@angular/material/progress-bar';


@NgModule({
  declarations: [ModalLoginOptionsComponent],
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBottomSheetModule,
    MatListModule,
    MatSnackBarModule,
    MatProgressBarModule
  ],
  entryComponents: [
    ModalLoginOptionsComponent
  ],
})
export class SharedModule { }
