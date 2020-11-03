import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JsregisterComponent } from './jsregister.component';
import { RegistrationComponent } from './registration/registration.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { AdminGuard } from  './../../../_services/admin.guard';

const routes: Routes = [
  { path: '', canActivate: [AdminGuard], component: JsregisterComponent },
  { path: 'signup', component: RegistrationComponent },
  { path: 'editProfile', canActivate: [AdminGuard],component: EditprofileComponent },
  { path: 'profile', canActivate: [AdminGuard],component: ProfileComponent },
  { path: 'changepassword', canActivate: [AdminGuard],component: ChangepasswordComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JsregisterRoutingModule { }
