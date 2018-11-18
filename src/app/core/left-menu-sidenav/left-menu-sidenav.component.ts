import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-left-menu-sidenav',
  templateUrl: './left-menu-sidenav.component.html',
  styleUrls: ['./left-menu-sidenav.component.css']
})
export class LeftMenuSidenavComponent implements OnInit {

  events: string[] = [];
  opened: boolean;
  constructor() { }

  ngOnInit() {
  }

}
