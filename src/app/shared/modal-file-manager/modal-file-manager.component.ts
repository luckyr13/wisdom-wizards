import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-file-manager',
  templateUrl: './modal-file-manager.component.html',
  styleUrls: ['./modal-file-manager.component.scss']
})
export class ModalFileManagerComponent implements OnInit {
  tabLoadTimes: Date|null = null;

  constructor(
  		private _selfDialog: MatDialogRef<ModalFileManagerComponent>
  	) { }

  ngOnInit(): void {
  }

  getTimeLoaded() {
    if (!this.tabLoadTimes) {
      this.tabLoadTimes = new Date();
    }

    return this.tabLoadTimes;
  }

  close() {
  	this._selfDialog.close();
  }

}
