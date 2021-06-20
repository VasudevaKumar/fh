import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponentComponent } from './login-component/login-component.component';
import { ActivateComponent } from './activate/activate.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { ThankyouComponent } from './thankyou/thankyou.component';

const routes: Routes = [  
 
 { path : 'activate/:string',component:ActivateComponent},
 { path : 'thankyou/:string',component:ThankyouComponent},
 { path : 'forgotPassword',  component:ForgotPasswordComponent},
 { path : 'updatePassword/:string',component:UpdatePasswordComponent},
 { path: 'careermanagers', loadChildren: () => import('./careermanagers/careermanagers.module').then(m => m.CareermanagersModule) },
 { path: 'jsregister', loadChildren: () => import('./jsregister/jsregister.module').then(m => m.JsregisterModule) },
 { path: 'jspostings', loadChildren: () => import('./jspostings/jspostings.module').then(m => m.JspostingsModule) },
 { path: 'jsjobs', loadChildren: () => import('./jsjobs/jsjobs.module').then(m => m.JsjobsModule) },
 { path: 'hrregister', loadChildren: () => import('./hrregister/hrregister.module').then(m => m.HrregisterModule) },
 { path: 'hrpostings', loadChildren: () => import('./hrpostings/hrpostings.module').then(m => m.HrpostingsModule) },
 { path: 'js', loadChildren: () => import('./jsmessages/jsmessages.module').then(m => m.JsmessagesModule) },
 { path: 'fhdashboard', loadChildren: () => import('./fhdashboard/fhdashboard.module').then(m => m.FhdashboardModule) },
 { path: 'capturevideo', loadChildren: () => import('./jsvideo/jsvideo.module').then(m => m.JsvideoModule) },
 { path: '', component: LoginComponentComponent },
  { path: '**', component: LoginComponentComponent }
];
@NgModule({
 imports: [
     RouterModule.forRoot(routes, {
})],
 exports: [RouterModule]
})
export class AppRoutingModule {}
