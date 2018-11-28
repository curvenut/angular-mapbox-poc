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

  private clickedButton(event: Event) {
    const  target = event.target || event.srcElement || event.currentTarget;
    const targetId = (target as any).id;
    console.log(' Button clicked  %o id = %s', event,  targetId);

    switch (targetId) {
      case 'button1':
        this.updateDataFromGeojson();
        break;
      case 'button2':
        this.testMultipleHttp();
        break;
      case 'button3':
        this.testMultipleHttpObservables();
        break;
      default:
        break;
    }

  }


  private updateDataFromGeojson() {
    const num = Math.floor(Math.random() * (150 - 20 + 1) + 20);
    this.mapService.updateData(num);
  }

  private testMultipleHttp() {
    this.mapService.testMultipleHttp();

  }

  private testMultipleHttpObservables(){
    this.mapService.testMultipleHttpObs().subscribe( (data: any[]) => {
      console.log(' testMultipleHttpObservables result= %o', data);
    });
  }
}
