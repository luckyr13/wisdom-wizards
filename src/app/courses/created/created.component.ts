import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ArweaveService } from '../../auth/arweave.service';
import { Observable, Subscription, EMPTY } from 'rxjs';
import { WisdomWizardsContract } from '../../core/contracts/wisdom-wizards';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-created',
  templateUrl: './created.component.html',
  styleUrls: ['./created.component.scss']
})
export class CreatedComponent implements OnInit, OnDestroy {
	loading: boolean = false;
  createdCourses$: Subscription = Subscription.EMPTY;
  coursesCreatedById: any[] = [];
  loadingActivate: boolean = false;
  txmessageActivate: string = '';

  constructor(
  	private _location: Location,
    private _snackBar: MatSnackBar,
    private _arweave: ArweaveService,
    private _wisdomWizards: WisdomWizardsContract,
    private _auth: AuthService
  ) { }


  ngOnInit(): void {
    this.loading = true;
    this.getMyCreatedCourses();
  }

  ngOnDestroy() {
    if (this.createdCourses$) {
      this.createdCourses$.unsubscribe();
    }
  }

  /*
  *  @dev Navigate to previous page
  */
  goBack() {
  	this._location.back();
  }

  /*
  *  Custom snackbar message
  */
  message(msg: string, panelClass: string = '', verticalPosition: any = undefined) {
    this._snackBar.open(msg, 'X', {
      duration: 8000,
      horizontalPosition: 'center',
      verticalPosition: verticalPosition,
      panelClass: panelClass
    });
  }

  /*
  *  @dev Get my list of created courses
  */
  getMyCreatedCourses() {
    this.createdCourses$ = this._wisdomWizards.getMyCreatedCourses(
      this._arweave.arweave,
      this._auth.getPrivateKey()
    ).subscribe({
      next: (res) => {
        this.coursesCreatedById = res;
        this.loading = false;

      },
      error: (error) => {
        console.log('error', error);
        this.message('Error!', 'error');
      }
    });
  }

  activateCourse(courseId: number, active: boolean) {
    this.loadingActivate = true;
    // Save data 
    this._wisdomWizards.activateDeactivateCourse(
      this._arweave.arweave,
      this._auth.getPrivateKey(),
      courseId,
      active
    ).subscribe({
      next: (res) => {
        this.loadingActivate = false;
        this.message(`Success! TXID: ${res}`, 'success');
        this.txmessageActivate = `https://viewblock.io/arweave/tx/${res}`;

        const modifiedCourse = this.coursesCreatedById.filter(e => e.id == courseId)[0];
        modifiedCourse.txid = res;
        modifiedCourse.txurl = this.txmessageActivate;
        // this._router.navigate(['/courses/created']);
      },
      error: (error) => {
        this.loadingActivate = false;
        this.message(`Error ${error}`, 'error');
        // this.disableForm(false);
      }
    });
  }

  /*
  *  @dev
  */
  winstonToAr(_v: string) {
    return this._arweave.winstonToAr(_v);
  }

  
}
