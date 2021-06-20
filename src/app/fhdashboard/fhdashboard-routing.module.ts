import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FhdashboardComponent } from './fhdashboard.component';
import { HrauthService } from  './../../../_services/hrauth.service';

const routes: Routes = [{ path: '', canActivate: [HrauthService],  component: FhdashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FhdashboardRoutingModule { }
