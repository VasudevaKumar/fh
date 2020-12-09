import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JsregisterRoutingModule } from './jsregister-routing.module';
import { JsregisterComponent } from './jsregister.component';
import { RegistrationComponent } from './registration/registration.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import { NgxSpinnerModule } from "ngx-spinner";
import { EditprofileComponent } from './editprofile/editprofile.component';
import { ProfileComponent } from './profile/profile.component';
import { Pipe, PipeTransform } from '@angular/core';
import { ChangepasswordComponent } from './changepassword/changepassword.component';



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
  declarations: [JsregisterComponent, RegistrationComponent, EditprofileComponent, ProfileComponent,replaceImg78Pipe,
    replaceImg40Pipe,ChangepasswordComponent,truncatetextPipe],
  imports: [
    CommonModule,
    JsregisterRoutingModule,
    NgxIntlTelInputModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMultiSelectModule,
    AutocompleteLibModule,
    FontAwesomeModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatNativeDateModule,
    NgxSpinnerModule
    
  ]
})
export class JsregisterModule { }
