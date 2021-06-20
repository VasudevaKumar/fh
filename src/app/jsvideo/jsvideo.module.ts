import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatButtonModule} from '@angular/material/button';
import { JsvideoRoutingModule } from './jsvideo-routing.module';
import { JsvideoComponent } from './jsvideo.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';

@NgModule({
  declarations: [JsvideoComponent],
  imports: [
    CommonModule,
    JsvideoRoutingModule,
    MatStepperModule,
    MatInputModule,
    MatTableModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule
  
  ]
})
export class JsvideoModule { }
