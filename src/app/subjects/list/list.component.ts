import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
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
	subjects: any = {};
  subjectsSubscription: Subscription = Subscription.EMPTY;

  constructor(
  	private _wisdomWizards: WisdomWizardsContract,
  	private _arweave: ArweaveService,
  	private _snackBar: MatSnackBar,
    private _router: Router,
    private _auth: AuthService,
    private _location: Location
  ) { }

  ngOnInit(): void {
    // Update loading inside
  	this.getSubjects();
  }

  ngOnDestroy() {
    if (this.subjectsSubscription) {
      this.subjectsSubscription.unsubscribe();
    }
  }



  getSubjects() {
    this.loading = true;
    // Get the local copy instead of the state's copy
  	this.subjectsSubscription = this._wisdomWizards.getSubjects().subscribe({
  		next: (subjects) => {
  			this.subjects = subjects;
        this.loading = false;
  		},
  		error: (error) => {
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
  getNumCourses(_courses: any) {
    const subjects = Object.keys(_courses);
    const numSubjects = subjects.length;
    let res = 0;

    for (let i = 0; i < numSubjects; i++) {
      res += _courses[subjects[i]].length;
    }

    return res;
  }

  getKeys(_obj: any) {
    return Object.keys(_obj);
  }

  /*
  *  @dev Navigate to previous page
  */
  goBack() {
    this._location.back();
  }

}
