import { environment as env } from './../environments/environment';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import * as markers from './core/mocks/sampleMarkers.json';


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
      zoom: 9
    });


    this.initMapEvent();


  }


  private initMapEvent() {
    this.addLayers();
    this.map.on('load', (e) => {
      const features = this.map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      const  clusterId = features[0].properties.cluster_id;

      (this.map.getSource('markers') as mapboxgl.GeoJSONSource).getClusterExpansionZoom(clusterId,  (err, zoom) => {
          if (err) {
              return;
          }
          const feature = features[0];
          this.map.easeTo({
              center: (feature.geometry as any).coordinates,
              zoom: zoom
          });
      });
    });
  }

  private addLayers() {
    this.map.addSource('markers', {
      type: 'geojson',
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
      data: './core/mocks/sampleMarkers.json'
    });

    this.map.addLayer({
      id: 'markers',
      type: 'circle',
      source: 'markers',
      filter: ['has', 'point_count'],
      paint: {
        // Use step expressions (https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',
          100,
          '#f1f075',
          750,
          '#f28cb1'
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,
          100,
          30,
          750,
          40
        ]
      }
    });

  }


  private async loadData() {

    // this.loadDataFile('./app/');
  }

  private loadDataFile(filePath: string): Observable<FeatureCollection<Geometry, GeoJsonProperties>> {
    return this.http.get<FeatureCollection<Geometry, GeoJsonProperties>>(filePath);
  }

}
