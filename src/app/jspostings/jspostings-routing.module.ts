import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JspostingsComponent } from './jspostings.component';
import { ConnectionsComponent } from './connections/connections.component';
import { MyactivityComponent } from './myactivity/myactivity.component';

import { AdminGuard } from  './../../../_services/admin.guard';

const routes: Routes = [
  { path: '', canActivate: [AdminGuard] , component: JspostingsComponent },
  { path: 'connections', canActivate: [AdminGuard] , component: ConnectionsComponent },
  { path: 'myactivity', canActivate: [AdminGuard] , component: MyactivityComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JspostingsRoutingModule { }
