import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';


@Injectable()
export class AppService {

  public stringSubject = new Subject<string>();

  passValue(data) {
    //passing the data as the next observable
    this.stringSubject.next(data);
  }

}
