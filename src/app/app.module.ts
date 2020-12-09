import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { AlertsModule } from 'angular-alert-module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgxSpinnerModule } from "ngx-spinner";
import {MatIconModule} from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponentComponent } from './login-component/login-component.component';
import { ActivateComponent } from './activate/activate.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { ConfirmationDialogComponentComponent } from './confirmation-dialog-component/confirmation-dialog-component.component';
import { MenucomponentComponent } from './menucomponent/menucomponent.component';
import { Pipe, PipeTransform } from '@angular/core';
import { NgChatModule } from 'ng-chat';


@Pipe({name: 'replaceImg78'})
export class replaceImg78Pipe implements PipeTransform {
  transform(value: string): string {
    return value.replace('profilePics_130','profilePics_78');
  }
}

@Pipe({name: 'replaceImg40'})
export class replaceImg40Pipe implements PipeTransform {
  transform(value: string): string {
    return value.replace('profilePics_130','profilePics_40');
  }
}

@Pipe({
  name: 'truncatetext'
 })
  export class truncatetextPipe implements PipeTransform {
  transform(value: string, args: any[]): string {
     const limit = args.length > 0 ? parseInt(args[0], 10) : 20;
     const trail = args.length > 1 ? args[1] : '...';
     return value.length > limit ? value.substring(0, limit) + trail : value;
    }
 }

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AlertsModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    NgxIntlTelInputModule,
    AppRoutingModule,
    NgxSpinnerModule,
    NgChatModule
    
  ],
  declarations: [
    AppComponent,
    LoginComponentComponent,
    ActivateComponent,
    ForgotPasswordComponent,
    UpdatePasswordComponent,
    ConfirmationDialogComponentComponent,
    MenucomponentComponent,
    replaceImg78Pipe,
    replaceImg40Pipe,
    truncatetextPipe
    

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
