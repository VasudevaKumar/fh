import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { Pipe, PipeTransform } from '@angular/core';
import { ImageCropperModule } from 'ngx-image-cropper';


import { AgGridModule } from 'ag-grid-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HrpostingsRoutingModule } from './hrpostings-routing.module';
import { HrpostingsComponent } from './hrpostings.component';
import { PostjobComponent } from './postjob/postjob.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { EditjobComponent } from './editjob/editjob.component';
import { UserprofilesComponent } from './userprofiles/userprofiles.component';
import { ViewprofileComponent } from './viewprofile/viewprofile.component';

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
  declarations: [HrpostingsComponent, replaceImg78Pipe,replaceImg40Pipe, PostjobComponent, EditjobComponent, UserprofilesComponent, ViewprofileComponent],
  imports: [
    CommonModule,
    HrpostingsRoutingModule,
    
     ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AngularEditorModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    AutocompleteLibModule,
    AngularMultiSelectModule,
    MatNativeDateModule,
    NgxIntlTelInputModule,
    ImageCropperModule,
    FontAwesomeModule,
    AgGridModule.withComponents([]),
    NgbModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HrpostingsModule { }
