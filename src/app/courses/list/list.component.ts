import { Component, OnInit } from '@angular/core';
import { WisdomWizardsContract } from '../../contracts/wisdom-wizards';
import { ArweaveService } from '../../auth/arweave.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
	loading: boolean = false;
	subjects: string[] = [];
  hideSubjects: boolean = false;
  courses: any[] = [];
  filteredCourses: any[] = [];

  constructor(
  	private _wisdomWizards: WisdomWizardsContract,
  	private _arweave: ArweaveService,
  	private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  	this.loading = true;

    // Update loading state inside
  	this.getSubjects();
  }

  getSubjects() {
  	this._wisdomWizards.getSubjects(
  		this._arweave.arweave,
  		this._arweave.getPrivateKey()
  	).subscribe({
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

    if (!Object.prototype.hasOwnProperty.call(this.courses, subjectId)) {
      this.message(`There are no courses on this category`, 'error');
      return;
    }

    this.filteredCourses = [];
    for (let course of this.courses[subjectId]) {
      this.filteredCourses.push(course);
    }
  }

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
