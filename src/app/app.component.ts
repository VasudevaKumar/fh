import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Location } from "@angular/common";
import { Router } from "@angular/router";
// import { fhAdapter } from '../../_services/fhadapter';
import {InteractionService} from'../../_services/interaction.service';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { RegisterService } from '../../_services/register.service';
import { ChatAdapter } from 'ng-chat';
// import { DemoAdapter } from './../../_services/fhadapter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ssr-serverless';
  
  platform: string;
  public isHeaderVisible = true;
  public isChatVisible = false;
  // public adapter: ChatAdapter = new fhAdapter('0', this.http);
  userId:any;
  username:any;
  avatar:any;

   public adapter: ChatAdapter;
  
  currentUser: any;
  loggedInEmployeeID: any;


  constructor(@Inject(PLATFORM_ID) private platformId: any, location: Location, router: Router,private _interactionService:InteractionService, private http: HttpClient, private registerService : RegisterService) 
{
  router.events.subscribe(val => {
    if(location.path() == '/hrpostings' || location.path() ==  '/careermanagers' || location.path() ==  '/careermanagers/register')
    {
      this.isHeaderVisible = false;
    }else{
      this.isHeaderVisible = true;
    }
  });

  this.isChatVisible = false;
  this.userId = '';
  
}

public ngOnInit(): void {
  this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  this.isChatVisible = false;
  if(this.currentUser!=null)
  {
   //  this.userId = this.currentUser[0].user_id;
   //  this.username = this.currentUser[0].user_id;
   //  this.InitializeSocketListerners(); 
   //  this.joinRoom();

    this.loggedInEmployeeID = this.currentUser[0].user_id;
    this.username = this.currentUser[0].displayName;
    this.avatar = this.currentUser[0].avatar;
    
    
    
  }

  // this.userId = 999;
  this._interactionService.teacherMessage$
  .subscribe(
    message => {
   });

   this._interactionService.isChatVisible$
  .subscribe(
    checkChatVisible => {
     this.isChatVisible = false;
   });
    
  this.platform = isPlatformBrowser(this.platformId) ? 'Browser' : 'Server';

  

}

  
}