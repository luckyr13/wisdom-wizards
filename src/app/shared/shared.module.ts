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
import { ModalFileManagerComponent } from './modal-file-manager/modal-file-manager.component';
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ModalRegisterComponent } from './modal-register/modal-register.component';


@NgModule({
    declarations: [
        ModalLoginOptionsComponent,
        ModalFileManagerComponent,
        ModalRegisterComponent
    ],
    imports: [
        CommonModule,
        MatListModule,
        MatIconModule,
        MatProgressBarModule,
        MatFormFieldModule,
        MatDialogModule,
        MatButtonModule,
        MatTabsModule,
        MatInputModule,
        MatProgressSpinnerModule
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
        MatSelectModule,
        MatDialogModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule
    ],
    providers: []
})
export class SharedModule { }
