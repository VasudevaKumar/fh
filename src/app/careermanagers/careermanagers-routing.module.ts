import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CareermanagersComponent } from './careermanagers.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', component: CareermanagersComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CareermanagersRoutingModule { }
