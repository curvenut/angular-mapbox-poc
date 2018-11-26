import { MapService } from './../services/map.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-left-menu-sidenav',
  templateUrl: './left-menu-sidenav.component.html',
  styleUrls: ['./left-menu-sidenav.component.css']
})
export class LeftMenuSidenavComponent implements OnInit {

  events: string[] = [];
  opened: boolean;
  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.mapService.getLayers();
  }

  private clickedButton(event) {
    console.log(' Button clicked   event = %o', event);
    let num = Math.floor(Math.random() * (150 - 20 + 1) + 20);
    this.mapService.updateData(num);
  }

}
