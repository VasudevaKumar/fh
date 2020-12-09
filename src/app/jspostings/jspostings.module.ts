import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JspostingsRoutingModule } from './jspostings-routing.module';
import { JspostingsComponent } from './jspostings.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ModalModule } from 'ngx-bootstrap/modal'; 
import { Pipe, PipeTransform } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConnectionsComponent } from './connections/connections.component';


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
  declarations: [JspostingsComponent,replaceImg78Pipe,replaceImg40Pipe, ConnectionsComponent,truncatetextPipe],
  imports: [
    CommonModule,
    JspostingsRoutingModule,
    ImageCropperModule,
    AngularEditorModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot()
  ]
})
export class JspostingsModule { }
