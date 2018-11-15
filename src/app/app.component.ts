import { environment as env } from '../environments/environment';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { markers } from './core/mocks/sampleMarkers';
import { Layers } from './model/map';


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
      // center : [-71.97722138410576, -13.517379300798098],
      zoom: 14
    });


    this.initMapEvent();


  }


  private initMapEvent() {


    this.map.on('load', (ev) => {
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



      this.map.on('click', Layers.MARKERS.name,  (e) => {



        // Change the cursor style as a UI indicator.
        this.map.getCanvas().style.cursor = 'pointer';

        const coordinates = (e.features[0].geometry as any).coordinates.slice();
        let content = 'applicationID  ' + e.features[0].properties.applicationID + '<br>' +
          'statusConsent ' + e.features[0].properties.statusConsent + '<br>' +
          'refApplicant ' + e.features[0].properties.refApplicant + '<br>' +
          'workType ' + e.features[0].properties.workType + '<br>' +
          'startDate  ' + e.features[0].properties.startDate + '<br>' +
          'endDate  ' + e.features[0].properties.endDate + '<br>' +
          'applicantName  ' + e.features[0].properties.applicantName + '<br>' +
          'statusWP  ' + e.features[0].properties.statusWP + '<br>' +
          'company  ' + e.features[0].properties.company + '<br>' +
          'wpLastUpdate ' + e.features[0].properties.wpLastUpdate + '<br>';

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        new mapboxgl.Popup({
          closeButton: true,
          closeOnClick: true
        }).setLngLat(coordinates)
          .setHTML(content)
          .addTo(this.map);
      });

      this.map.on('mouseenter', Layers.MARKERS.name, () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });

      this.map.on('mouseleave', Layers.MARKERS.name, () => {
        this.map.getCanvas().style.cursor = '';

      });


    });



  }



  private addLayers() {
    let layer: mapboxgl.Layer;
    let source: mapboxgl.GeoJSONSourceRaw;

    source = {
      type: 'geojson',
      data : markers
    };


    // layer = {
    //   id: Layers.MARKERS.name,
    //   type: 'circle',
    //   source: Layers.MARKERS.sourceName,
    //   layout: {
    //     'visibility': 'visible'
    //   },
    //   paint: {
    //     'circle-color': 'red',
    //     'circle-radius': 5,
    //     'circle-opacity': 1
    //   }
    // };

    layer = {
      id: Layers.MARKERS.name,
      type: 'symbol',
      source: Layers.MARKERS.sourceName,
      layout: {
        'icon-image': 'marker-15',
        'visibility': 'visible',
        'text-field': '{applicantName}',
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],

      },
      paint: {
        'icon-color': 'red'
      }
    };
    this.map.addSource(Layers.MARKERS.sourceName , source);

    this.map.addLayer(layer);

    console.log(' map source=%o', this.map.getSource(Layers.MARKERS.sourceName));
    console.log(' map layer=%o', this.map.getLayer(Layers.MARKERS.name));
  }


  private async loadData() {

    this.loadDataFile('./app/');
  }

  private loadDataFile(filePath: string): Observable<FeatureCollection<Geometry, GeoJsonProperties>> {
    return this.http.get<FeatureCollection<Geometry, GeoJsonProperties>>(filePath);
  }

}
