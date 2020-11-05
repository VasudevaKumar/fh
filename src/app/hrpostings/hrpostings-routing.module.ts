import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HrpostingsComponent } from './hrpostings.component';
import { PostjobComponent } from './postjob/postjob.component';
import { EditjobComponent } from './editjob/editjob.component';
import { UserprofilesComponent } from './userprofiles/userprofiles.component';
import { ViewprofileComponent } from './viewprofile/viewprofile.component';

import { HrauthService } from  './../../../_services/hrauth.service';

const routes: Routes = [
    { path: '', canActivate: [HrauthService] ,component: HrpostingsComponent },
    { path: 'postJob', canActivate: [HrauthService] , component: PostjobComponent },
    { path: 'editJob/:id', canActivate: [HrauthService] , component: EditjobComponent },
    { path: 'userprofile/:id', canActivate: [HrauthService] , component: UserprofilesComponent },
    { path: 'viewprofile/:id', canActivate: [HrauthService] , component: ViewprofileComponent }

  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrpostingsRoutingModule { }
