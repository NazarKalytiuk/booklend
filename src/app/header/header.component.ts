import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor() {}
  searchOpened = false;
  showMenu = true;
  mobile = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (window.innerWidth < 480) {
      this.showMenu = false;
      this.mobile = true;
    } else {
      this.mobile = false;
    }
  }

  ngOnInit(): void {
    if (window.innerWidth < 480) {
      this.showMenu = false;
      this.mobile = true;
    }
  }

  openSearchBar(): void {
    this.searchOpened = true;
  }
  closeSearchBar(): void {
    this.searchOpened = false;
  }

  openMenu(): void {
    this.showMenu = true;
  }
  closeMenu(): void {
    this.showMenu = false;
  }
}
