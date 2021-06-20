import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  private _teacherMessageSource = new Subject<string>();
  private _isChatVisbleMsg = new Subject<string>();
  teacherMessage$ = this._teacherMessageSource.asObservable();
  isChatVisible$ = this._isChatVisbleMsg.asObservable();
  constructor() { }

  sendMessage(message:any)
  {
//     alert(message);
    this._teacherMessageSource.next(message);
  }

  checkChatVisible(isChatVisible:any)
  {
    this._isChatVisbleMsg.next(isChatVisible);
  }
}
