import { Component, OnInit, OnDestroy } from '@angular/core';
import { WisdomWizardsContract } from '../../core/contracts/wisdom-wizards';
import { ArweaveService } from '../../core/arweave.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  mainAddress: string = this._auth.getMainAddressSnapshot();
	loading: boolean = false;
  courses: any[] = [];
  filteredCourses: any[] = [];
  coursesSubscription: Subscription = Subscription.EMPTY;

  constructor(
  	private _wisdomWizards: WisdomWizardsContract,
  	private _arweave: ArweaveService,
  	private _snackBar: MatSnackBar,
    private _router: Router,
    private _auth: AuthService
  ) { }

  ngOnInit(): void {
    this.getCourses();
  }

  ngOnDestroy() {

  }

  getCourses() {
    this.loading = true;
    this.coursesSubscription = this._wisdomWizards.getActiveCoursesFromState().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;

        console.log('courses', this.courses);
      },
      error: (error) => {
        console.log('error', error);
        this.message(`Error: ${error}`, 'error');
        this.loading = false;
      }
    });
  }

  /*
  *	@dev Custom snackbar message
  */
  message(msg: string, panelClass: string = '', verticalPosition: any = undefined) {
    this._snackBar.open(msg, 'X', {
      duration: 6000,
      horizontalPosition: 'center',
      verticalPosition: verticalPosition,
      panelClass: panelClass
    });
  }

  /*
  *  @dev
  */
  winstonToAr(_v: string) {
    return this._arweave.winstonToAr(_v);
  }

  /*
  *  @dev
  */
  getNumCourses(_courses: any) {
    const subjects = Object.keys(_courses);
    const numSubjects = subjects.length;
    let res = 0;

    for (let i = 0; i < numSubjects; i++) {
      res += _courses[subjects[i]].length;
    }

    return res;
  }
}
