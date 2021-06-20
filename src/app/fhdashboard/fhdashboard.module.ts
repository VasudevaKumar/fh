import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { FhdashboardRoutingModule } from './fhdashboard-routing.module';
import { FhdashboardComponent } from './fhdashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [FhdashboardComponent],
  imports: [
    CommonModule,
    FhdashboardRoutingModule,
    AgGridModule.withComponents([]),
    NgbModule
    
  ]
})
export class FhdashboardModule { }
