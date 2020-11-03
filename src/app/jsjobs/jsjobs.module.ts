import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsjobsRoutingModule } from './jsjobs-routing.module';
import { JsjobsComponent } from './jsjobs.component';
import { JobdetailComponent } from './jobdetail/jobdetail.component';
import { Pipe, PipeTransform } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MyjobsComponent } from './myjobs/myjobs.component';

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
  declarations: [JsjobsComponent,JobdetailComponent,replaceImg78Pipe,replaceImg40Pipe, MyjobsComponent],
  imports: [
    CommonModule,
    JsjobsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class JsjobsModule { }
