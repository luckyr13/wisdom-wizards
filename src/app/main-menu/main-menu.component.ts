import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {
	@Input() opened: boolean = false;
	@Output() openedChange = new EventEmitter();
  @Input() routeLang: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  toggleSideMenu() {
    this.opened = !this.opened;
    this.openedChange.emit(this.opened);
  }

}
