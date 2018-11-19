import { MapService } from './../services/map.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.mapService.buildMap();
  }

}
