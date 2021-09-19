import { Component, OnInit } from '@angular/core';
import { WisdomWizardsContract } from '../../core/contracts/wisdom-wizards';
import { ArweaveService } from '../../auth/arweave.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { SubjectService } from '../../core/subject.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  mainAddress: string = this._auth.getMainAddressSnapshot();
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
    private _router: Router,
    private _auth: AuthService,
    private _subject: SubjectService
  ) { }

  ngOnInit(): void {
  	this.loading = true;

    // Update loading inside
  	this.getSubjects();
  }

  getSubjects() {
    // Get the local copy instead of the state's copy
  	this._subject.getSubjectsLocalCopy().subscribe({
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
    this._wisdomWizards.getActiveCoursesFromState(
      this._arweave.arweave
    ).subscribe({
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
