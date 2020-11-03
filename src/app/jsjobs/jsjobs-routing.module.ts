import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JsjobsComponent } from './jsjobs.component';
import { JobdetailComponent } from './jobdetail/jobdetail.component';
import { MyjobsComponent } from './myjobs/myjobs.component';
import { AdminGuard } from  './../../../_services/admin.guard';

const routes: Routes = [
    { path: '', canActivate: [AdminGuard] , component: JsjobsComponent },
    { path: 'jobdetail', canActivate: [AdminGuard] , component: JobdetailComponent },
    { path: 'myjobs', canActivate: [AdminGuard] , component: MyjobsComponent }
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JsjobsRoutingModule { }
