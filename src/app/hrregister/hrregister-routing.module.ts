import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HrregisterComponent } from './hrregister.component';
import { HomeComponent } from './home/home.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { CompanyprofileComponent } from './companyprofile/companyprofile.component';
import { HrauthService } from  './../../../_services/hrauth.service';


const routes: Routes = [
  { path: '', component: HrregisterComponent },
  { path: 'home', canActivate: [HrauthService],component: HomeComponent },
  { path: 'editprofile', canActivate: [HrauthService], component: EditprofileComponent },
  { path: 'changepassword', canActivate: [HrauthService], component: ChangepasswordComponent },
  {path : 'profile/:id', canActivate: [HrauthService] , component:CompanyprofileComponent,}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrregisterRoutingModule { }
