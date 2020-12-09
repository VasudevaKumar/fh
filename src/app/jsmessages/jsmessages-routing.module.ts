import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JsmessagesComponent } from './jsmessages.component';
import { AdminGuard } from  './../../../_services/admin.guard';

const routes: Routes = [{ path: 'messages', canActivate: [AdminGuard] , component: JsmessagesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JsmessagesRoutingModule { }
