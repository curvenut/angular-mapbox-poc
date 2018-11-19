
import { LeftMenuSidenavComponent } from './core/left-menu-sidenav/left-menu-sidenav.component';
import { MaterialModule } from './material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule} from '@angular/flex-layout';
import { MapComponent } from './core/map/map.component';
import { ServicesModule} from './core/services/services.module';

@NgModule({
  declarations: [
    AppComponent,
    LeftMenuSidenavComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    FlexLayoutModule,
  ],
  providers: [ServicesModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
