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
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [ModalLoginOptionsComponent],
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatProgressBarModule,
    MatFormFieldModule
  ],
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBottomSheetModule,
    MatListModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatCardModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule
  ],
  entryComponents: [
    ModalLoginOptionsComponent
  ],
})
export class SharedModule { }
