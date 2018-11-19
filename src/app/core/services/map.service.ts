import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  public getLayers() {
    console.log(' getLayers()');
  }
}
