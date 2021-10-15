import { Component, OnInit, Input } from '@angular/core';
import anime from 'animejs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() address: string|null = '';
  @Input() network: string|null = '';

  constructor() {

  }

  ngOnInit(): void {
  	
  }


  ngAfterViewInit() {
    this.animateTxt();
  }

  animateTxt() {
    anime({
      targets: '#footer-wisdom-txt ',
      color: this.randomColor,
      duration: 2000,
      direction: 'alternate',
      easing: 'linear',
      complete: () => {
        this.animateTxt();
      }
    });
  }

  randomColor() {
    const colors = ['59f273', 'b058f4', 'ef585d', 'ef58e8', 'fff53a', 'b5fffd'];
    const randomIndex = Math.floor( (Math.random() * 100) % colors.length );
    const res = `#${colors[randomIndex]}`;
    return res;
  }

}
