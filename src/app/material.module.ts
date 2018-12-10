import {NgModule} from '@angular/core';

import {
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatListModule,
  MatCheckboxModule,
  MatButtonModule
} from '@angular/material';

@NgModule({
  exports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatButtonModule
  ]
})
export class MaterialModule {}
