import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
  @Input() items: any[];
  startIndex = 0;
  count = 4;
  show = [];

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (window.innerWidth < 480) {
      this.count = 2;
    }
  }

  constructor() {}

  ngOnInit(): void {
    console.log(window.innerWidth);
    if (window.innerWidth < 480) {
      this.count = 2;
    }
    this.show = this.items.slice(this.startIndex, this.count + this.startIndex);
  }

  prev(): void {
    if (this.startIndex === 0) {
      return;
    }
    this.startIndex--;
    this.show = this.items.slice(this.startIndex, this.count + this.startIndex);
  }
  next(): void {
    if (this.startIndex === this.items.length - 1) {
      return;
    }
    this.startIndex++;
    this.show = this.items.slice(this.startIndex, this.count + this.startIndex);
  }
}
