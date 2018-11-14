import { environment as env } from './../environments/environment';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { markers } from './core/mocks/sampleMarkers';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  mapStyle = 'mapbox://styles/mapbox/streets-v9';
  map: mapboxgl.Map;
  opened: boolean;

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
    this.loadData();
    this.buildMap();
  }

  private buildMap() {
    const accessToken = env.mapbox.accessToken;
    // Hask to mettre le tocken,  normalement
    (mapboxgl.accessToken as any) = accessToken;

    this.map = new mapboxgl.Map({
      container: 'map',
      style: env.mapbox.style,
      center: [env.mapbox.center.lng, env.mapbox.center.lat],
      //center : [-71.97722138410576, -13.517379300798098],
      zoom: 14
    });


    this.initMapEvent();


  }


  private initMapEvent() {

      this.map.on('load', (e) => {
        // const features = this.map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        // const  clusterId = features[0].properties.cluster_id;

        this.addLayers();
        // (this.map.getSource('markers') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(clusterId,  (err, zoom) => {
        //     if (err) {
        //         return;
        //     }
        //     const feature = features[0];
        //     this.map.easeTo({
        //         center: (feature.geometry as any).coordinates,
        //         zoom: zoom
        //     });
        // });
      });

  }


  private addLayers2() {
   this.map.addLayer({
      'id': 'maine',
      'type': 'fill',
      'source': {
          'type': 'geojson',
          'data': {
              'type': 'Feature',
              'geometry': {
                  'type': 'Polygon',
                  'coordinates': [[[-67.13734351262877, 45.137451890638886],
                      [-66.96466, 44.8097],
                      [-68.03252, 44.3252],
                      [-69.06, 43.98],
                      [-70.11617, 43.68405],
                      [-70.64573401557249, 43.090083319667144],
                      [-70.75102474636725, 43.08003225358635],
                      [-70.79761105007827, 43.21973948828747],
                      [-70.98176001655037, 43.36789581966826],
                      [-70.94416541205806, 43.46633942318431],
                      [-71.08482, 45.3052400000002],
                      [-70.6600225491012, 45.46022288673396],
                      [-70.30495378282376, 45.914794623389355],
                      [-70.00014034695016, 46.69317088478567],
                      [-69.23708614772835, 47.44777598732787],
                      [-68.90478084987546, 47.184794623394396],
                      [-68.23430497910454, 47.35462921812177],
                      [-67.79035274928509, 47.066248887716995],
                      [-67.79141211614706, 45.702585354182816],
                      [-67.13734351262877, 45.137451890638886]]]
              }
          }
      },
      'layout': {},
      'paint': {
          'fill-color': '#088',
          'fill-opacity': 0.8
      }
  }as any);

  }

  private addLayers() {


    this.map.addSource('markers', {
      type: 'geojson',
      data : markers as any
    });

    this.map.addLayer({
      id: 'markersLayer',
      type: 'circle',
      source: 'markers',
      layout: {
        'visibility': 'visible'
      },
      paint: {
        'circle-color': 'yellow',
        'circle-radius': 20,
        'circle-opacity': 1
      }
    });

    console.log(' map source=%o', this.map.getSource('markers'));
    console.log(' map layer=%o', this.map.getLayer('markersLayer'));
  }


  private async loadData() {

    this.loadDataFile('./app/');
  }

  private loadDataFile(filePath: string): Observable<FeatureCollection<Geometry, GeoJsonProperties>> {
    return this.http.get<FeatureCollection<Geometry, GeoJsonProperties>>(filePath);
  }

}
