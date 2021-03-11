import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ArweaveService } from '../../auth/arweave.service';
import { Observable, Subscription, EMPTY } from 'rxjs';
import { WisdomWizardsContract } from '../../contracts/wisdom-wizards';

@Component({
  selector: 'app-created',
  templateUrl: './created.component.html',
  styleUrls: ['./created.component.scss']
})
export class CreatedComponent implements OnInit {
	loading: boolean = false;
  userInfo: any = {};
  userInfo$: Subscription = Subscription.EMPTY;
  coursesCreatedById: number[] = [];
  loadingActivate: boolean = false;
  txmessageActivate: string = '';

  constructor(
  	private _location: Location,
    private _snackBar: MatSnackBar,
    private _arweave: ArweaveService,
    private _wisdomWizards: WisdomWizardsContract
  ) { }


  ngOnInit(): void {
    this.loading = true;
    this.getUserInfo();
  }

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
  *  @dev Get user info
  */
  getUserInfo() {
    this.userInfo$ = this._wisdomWizards.getUserInfo(
      this._arweave.arweave,
      this._arweave.getPrivateKey()
    ).subscribe({
      next: (res) => {
        console.log('user', res);

        this.userInfo = res;
        this.coursesCreatedById = res.coursesCreated;
        this.loading = false;

      },
      error: (error) => {
        console.log('error', error);
        this.message('Error!', 'error');
      }
    });
  }

  activateCourse(courseId: number) {
    this.loadingActivate = true;
    const active = true;
    // Save data 
    this._wisdomWizards.activateDeactivateCourse(
      this._arweave.arweave,
      this._arweave.getPrivateKey(),
      courseId,
      active
    ).subscribe({
      next: (res) => {
        this.loadingActivate = false;
        this.message(`Success! TXID: ${res}`, 'success');
        this.txmessageActivate = `https://viewblock.io/arweave/tx/${res}`;

        // this._router.navigate(['/courses/created']);
      },
      error: (error) => {
        this.loadingActivate = false;
        this.message(`Error ${error}`, 'error');
        // this.disableForm(false);
      }
    });
  }

}
