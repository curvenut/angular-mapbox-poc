import { environment as env } from './../environments/environment';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  accessToken = env.mapbox.accessToken;
  map: mapboxgl.Map;

  ngOnInit(): void {
    this.buildMap();


  }

  private buildMap() {
    // Hask to mettre le tocken,  normalement
    (mapboxgl.accessToken as any) = 'pk.eyJ1IjoidmRtLWNtZSIsImEiOiJjamdlMGp5Y2IwMWU2MndwMzVweWg5emc2In0.Tdy8hdMSB8_T8dKZpKhl7A';

    let map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [env.mapbox.center.long, env.mapbox.center.long],
      zoom: 9
    });


  }

}
