import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { ChatAdapter, IChatGroupAdapter, Group, Message, ChatParticipantStatus, ParticipantResponse, ChatParticipantType, IChatParticipant, MessageType } from 'ng-chat';
import { fhAdapter } from '../../_services/fhadapter';
import {InteractionService} from'../../_services/interaction.service';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ssr-serverless';
  userId:any;
  platform: string;
  public isHeaderVisible = true;
  public isChatVisible = false;
  public adapter: ChatAdapter = new fhAdapter('0', this.http);
  

constructor(@Inject(PLATFORM_ID) private platformId: any, location: Location, router: Router,private _interactionService:InteractionService, private http: HttpClient) {
  router.events.subscribe(val => {
    if(location.path() == '/hrpostings' || location.path() ==  '/careermanagers' || location.path() ==  '/careermanagers/register')
    {
      this.isHeaderVisible = false;
    }else{
      this.isHeaderVisible = true;
    }
  });
}



public ngOnInit(): void {
    // this.userId = 999;
    this._interactionService.teacherMessage$
    .subscribe(
      message => {
      // console.log('serview');
       // console.log(message);
        this.userId = message[0]['user_id'];
        this.isChatVisible = true;
        
     });
      
    this.platform = isPlatformBrowser(this.platformId) ? 'Browser' : 'Server';
    
    this.adapter.listFriends();
  }
/*
  private fetchFriendsList(isBootstrapping: boolean): void
    {
        this.adapter.listFriends()
        .pipe(
            map((participantsResponse: ParticipantResponse[]) => {
                this.participantsResponse = participantsResponse;

                this.participants = participantsResponse.map((response: ParticipantResponse) => {
                    return response.participant;
                });
            })
        ).subscribe(() => {
            if (isBootstrapping)
            {
                this.restoreWindowsState();
            }
        });
    }
*/
  
  
  
  
  
  
}
