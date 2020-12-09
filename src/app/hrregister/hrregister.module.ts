import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HrregisterRoutingModule } from './hrregister-routing.module';
import { HrregisterComponent } from './hrregister.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { Pipe, PipeTransform } from '@angular/core';
import { NgxSpinnerModule } from "ngx-spinner";
import { ImageCropperModule } from 'ngx-image-cropper';
import { HomeComponent } from './home/home.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { CompanyprofileComponent } from './companyprofile/companyprofile.component';


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
@NgModule({
  declarations: [HrregisterComponent,replaceImg78Pipe,replaceImg40Pipe, HomeComponent, EditprofileComponent, ChangepasswordComponent, CompanyprofileComponent],
  imports: [
    CommonModule,
    HrregisterRoutingModule,
    NgxIntlTelInputModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMultiSelectModule,
    AutocompleteLibModule,
    FontAwesomeModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ImageCropperModule,
    MatInputModule,
    MatNativeDateModule,
    NgxSpinnerModule
  ]
})
export class HrregisterModule { }
