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
  mapStyle = 'mapbox://styles/mapbox/streets-v9';
  map: mapboxgl.Map;

  ngOnInit(): void {
    this.buildMap();
  }

  private buildMap() {
    const  accessToken = env.mapbox.accessToken;
    // Hask to mettre le tocken,  normalement
    (mapboxgl.accessToken as any) = accessToken;

    this.map = new mapboxgl.Map({
      container: 'map',
      style: env.mapbox.style,
      center: [env.mapbox.center.lng, env.mapbox.center.lat],
      zoom: 9
    });


    this.initMapEvent();


  }


  private initMapEvent() {

    this.map.on('load', () => {

    });
  }

}
