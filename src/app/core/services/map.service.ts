import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from '../../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { Layers } from '../../shared/models/map';
import { markers } from '../mocks/sampleMarkers';
import { FeatureCollection,  Geometry } from 'geojson';
// import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  mapStyle = 'mapbox://styles/mapbox/streets-v9';
  map: mapboxgl.Map;
  mapLayers: mapboxgl.Layer[];

  constructor(private http: HttpClient) { }

  /**
   * TODO: move map to a service and add a map component
   */
  public buildMap() {
    const accessToken = env.mapbox.accessToken;
    // Hask to mettre le tocken,  normalement
    (mapboxgl.accessToken as any) = accessToken;

    //  Street V8 : https://www.mapbox.com/vector-tiles/mapbox-streets-v8/
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

      this.testMultipleHttp();

      this.addLayers();

      this.listLayers();
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



      this.map.on('click', Layers.MARKERS.name, (e) => {



        // Change the cursor style as a UI indicator.
        this.map.getCanvas().style.cursor = 'pointer';

        const coordinates = (e.features[0].geometry as any).coordinates.slice();
        const content = 'applicationID  ' + e.features[0].properties.applicationID + '<br>' +
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
      data: markers
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
        'text-offset': [0, -2.5],
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],

      }
    };
    this.map.addSource(Layers.MARKERS.sourceName, source);

    this.map.addLayer(layer);

    console.log(' map source=%o', this.map.getSource(Layers.MARKERS.sourceName));
    console.log(' map layer=%o', this.map.getLayer(Layers.MARKERS.name));
  }


  // private async loadData() {

  //   this.loadDataFile('./app/');
  // }

  // private loadDataFile(filePath: string): Observable<FeatureCollection<Geometry, GeoJsonProperties>> {
  //   return this.http.get<FeatureCollection<Geometry, GeoJsonProperties>>(filePath);
  // }

  private listLayers() {

    // Layers street V8 reference : https://www.mapbox.com/vector-tiles/mapbox-streets-v8/#layer-reference

    this.mapLayers = this.map.getStyle().layers;

    console.log(this.mapLayers);
    console.log(this.map.getLayer(Layers.MARKERS.name));
    console.log(this.map.getLayoutProperty(Layers.MARKERS.name, 'visibility'));
    // this.map.setLayoutProperty(Layers.MARKERS.name, 'visibility', 'none');
  }

  public getLayers() {
    console.log(' getLayers()');
  }

  private testMultipleHttp() {
    const url1 = 'https://swapi.co/api/people';
    const page = '/?page=';
    let totalCount: number;
    const pageCount = 10;
    let currentCount: number;
    let urls: string[] = [];
    let data: any[] = [];
    const requests: Observable<any>[] = [];

    this.http.get(url1).subscribe((response: any) => {
      totalCount = response.count;
      currentCount = response.results.length;
      urls = this.buildUrl(totalCount, pageCount, url1, page);

      data = data.concat(response.results);
      console.log('DATA  = %o', data);

      urls.forEach(aUrl => {
        requests.push(this.http.get(aUrl));
      });
      console.log(' requests  ===  %o', requests);

      forkJoin(requests).subscribe(results => {
        console.log('results  = %o', results);
        results.forEach(element => {
          data = data.concat(element.results);
        });
        console.log('DATA  = %o', data);
      }, err => {
        console.error(err);
      });
    });

    data  = [];
    this.http.get(url1).subscribe((response) => {
       urls = this.buildSameURL(20 , url1, page);

      data = data.concat((response as any).results);
      console.log('\n\n\n========================\ First request  = %o', data);

      urls.forEach(aUrl => {
        requests.push(this.http.get(aUrl) );
      });
      console.log(' requests strinf to call  ===  %o', requests);

      forkJoin(requests).subscribe(results => {
        console.log(' Final results from each HTTP   = %o', results);
        results.forEach(element => {
          data = data.concat(element.results);
        });
        console.log(' All data   = %o', data);
      }, err => {
        console.error(err);
      });
    });
  }

  private buildUrl(totalCount: number, pageCount: number, url: string, page: string): string[] {
    const urls: string[] = [];
    let pageNumber = Math.floor(totalCount / pageCount);
    const  pageIndex = 2;

    console.log(' pageNumber = %s', pageNumber);
    // Le modulo est > 0 donc il faut faire un appel pagine de plus
    if ((totalCount % pageCount) > 0) {
      ++pageNumber;
      console.log(' pageNumber update = %s', pageNumber);
    }

    for (let index = pageIndex; index <= pageNumber; index++) {
      urls.push(url + page + index);
    }
    console.log(' URLS = %o', urls);
    return urls;
  }

  private buildSameURL(count: number, url: string, page: string): string[] {
    const  urls: string[] = [];
    const  pageNumber = 1;

    console.log(' pageNumber = %s', pageNumber);


    for (let index = 1; index <= count; index++) {
      urls.push(url + page + pageNumber);
    }
    console.log(' URLS = %o', urls);
    return urls;
  }

  /**
   * update the data of the map with new random point from the sampleMarkers data
   * @param num number of new feature to generate
   */
  public updateData(num: number) {
    let newData: FeatureCollection<Geometry>;

    newData = <FeatureCollection<Geometry>> turf.sample(markers as any, num);
    console.log('updateData :  new data length=%s   data=%o', newData.features.length, newData);
    (this.map.getSource(Layers.MARKERS.sourceName) as mapboxgl.GeoJSONSource).setData(newData);
  }
}
