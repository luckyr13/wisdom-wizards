import { Component, OnInit } from '@angular/core';
import { WisdomWizardsContract } from '../../contracts/wisdom-wizards';
import { ArweaveService } from '../../auth/arweave.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  mainAddress: string = this._arweave.getMainAddress();
	loading: boolean = false;
	subjects: any[] = [];
  hideSubjects: boolean = false;
  courses: any[] = [];
  filteredCourses: any[] = [];
  selectedSubject: any = null;

  constructor(
  	private _wisdomWizards: WisdomWizardsContract,
  	private _arweave: ArweaveService,
  	private _snackBar: MatSnackBar,
    private _router: Router
  ) { }

  ngOnInit(): void {
  	this.loading = true;

    if (!this.mainAddress) {
      this.message('Please login first!', 'error');
      this._router.navigate(['/home']);
      return;
    }

    // Update loading inside
  	this.getSubjects();
  }

  getSubjects() {
    // Get the local copy instead of the state's copy
  	this._wisdomWizards.getSubjectsLocalCopy().subscribe({
  		next: (subjects) => {
  			this.subjects = subjects;
        // Get courses data
        // Update loading state inside
        this.getCourses();
  		},
  		error: (error) => {
  			console.log('error', error);
  			this.message(`Error: ${error}`, 'error');
  		}
  	});
  }

  getCourses() {
    this._wisdomWizards.getCourses(
      this._arweave.arweave,
      this._arweave.getPrivateKey()
    ).subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;

        console.log(this.courses);
      },
      error: (error) => {
        console.log('error', error);
        this.message(`Error: ${error}`, 'error');
      }
    });
  }

  /*
  *  @dev Search courses
  */
  searchCoursesBySubject(subjectId: number) {
    this.hideSubjects = true;
    this.filteredCourses = [];
    this.selectedSubject = this.subjects[subjectId];

    if (!Object.prototype.hasOwnProperty.call(this.courses, subjectId)) {
      // this.message(`There are no courses on this category`, 'error');
      return;
    }

    for (let course of this.courses[subjectId]) {
      this.filteredCourses.push(course);
    }
  }

  /*
  *  @dev Display subjects
  */
  showSubjects() {
    this.hideSubjects = false;
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

}
