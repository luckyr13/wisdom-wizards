import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { WisdomWizardsContract } from '../../core/contracts/wisdom-wizards';
import { ArweaveService } from '../../core/arweave.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-detail',
  templateUrl: './view-detail.component.html',
  styleUrls: ['./view-detail.component.scss']
})
export class ViewDetailComponent implements OnInit {
	mainAddress: string = this._auth.getMainAddressSnapshot();
	loading: boolean = false;
	subject: any = {};
  courses: any = {};
  subjectSubscription: Subscription = Subscription.EMPTY;
  routeLang: string = '';
  routeSlug: string = '';

  constructor(
  	private _wisdomWizards: WisdomWizardsContract,
  	private _arweave: ArweaveService,
  	private _snackBar: MatSnackBar,
    private _router: Router,
    private _auth: AuthService,
    private _location: Location,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.routeLang = this._route.snapshot.paramMap.get('lang')!;
    this.routeSlug = this._route.snapshot.paramMap.get('slug')!;
    
  	this._route.paramMap.subscribe(async params => {
      const slug = params.get('slug');
      const lang = params.get('lang');
      this.routeLang = lang!;
      this.routeSlug = slug!;
    });

    // Update loading inside

    this.loading = true;
  	this.subjectSubscription = this.getSubject(this.routeSlug).pipe(
        switchMap((subject) => {
          return this.getCourses(subject.slug);
        })
      ).subscribe({
      next: (courses) => {
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.message(error, 'error');
      }
    });
  }

  getSubject(slug: string) {
    this.subject = {};
  	return this._wisdomWizards.getSubject(slug).pipe(
      tap((subjects) => {
        this.subject = subjects;
      }));
  }

  getCourses(subject: string) {
    this.courses = {};
    return this._wisdomWizards.getCourses(this.routeLang, subject).pipe(
      tap((courses) => {
        this.courses = courses;
      }));
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
