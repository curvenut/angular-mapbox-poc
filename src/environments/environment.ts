// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,


  mapbox: {
    accessToken : 'pk.eyJ1IjoidmRtLWNtZSIsImEiOiJjamdlMGp5Y2IwMWU2MndwMzVweWg5emc2In0.Tdy8hdMSB8_T8dKZpKhl7A',
    center: {
      lng: -73.567253,
      lat: 45.501690
    },
    style : 'mapbox://styles/mapbox/streets-v8',
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
