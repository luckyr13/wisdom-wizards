import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ArweaveService } from '../../auth/arweave.service';
import {  WisdomWizardsContract } from '../../contracts/wisdom-wizards';
import { Subscription, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-detail',
  templateUrl: './view-detail.component.html',
  styleUrls: ['./view-detail.component.scss']
})
export class ViewDetailComponent implements OnInit, OnDestroy {
  detail: any = null;
  detail$: Subscription = Subscription.EMPTY;
  loading: boolean = false;

  constructor(
    private _location: Location,
    private _arweave: ArweaveService,
    private _wisdomWizards: WisdomWizardsContract,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
   ) { }

  ngOnInit(): void {
    const courseId = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.loading = true;

    this.detail$ = this._wisdomWizards.getCourseDetail( 
      this._arweave.arweave, this._arweave.getPrivateKey(), courseId
    ).subscribe({
      next: (data) => {
        this.detail = data;
        if (this.detail.active) {
        } else {
          this.message('Course not found', 'error');
        }
        this.loading = false;
      },
      error: (error) => {
        this.message(error, 'error');
      }
    });

  }

  ngOnDestroy() {

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

}
