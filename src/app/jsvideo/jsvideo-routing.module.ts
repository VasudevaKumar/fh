import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JsvideoComponent } from './jsvideo.component';
import { AdminGuard } from  './../../../_services/admin.guard';

const routes: Routes = [{ path: '', canActivate: [AdminGuard], component: JsvideoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JsvideoRoutingModule { }
