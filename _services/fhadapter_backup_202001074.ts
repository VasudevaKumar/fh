import { ChatAdapter, IChatGroupAdapter, Group, Message, ChatParticipantStatus, ParticipantResponse, ChatParticipantType, IChatParticipant, MessageType } from 'ng-chat';
import { Observable, of } from 'rxjs';
import { delay } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

export class fhAdapter extends ChatAdapter implements IChatGroupAdapter
{   
    constructor(private username: string, private http: HttpClient) {
        super();
      }
    
    public  static mockedParticipants: IChatParticipant[] = [];
    public  serverBaseUrl: string = 'http://localhost/fhapi/friendlist';



    listFriends(): Observable<ParticipantResponse[]> {
        return of(fhAdapter.mockedParticipants.map(user => {
            let participantResponse = new ParticipantResponse();
            participantResponse.participant = user;
                        participantResponse.metadata = {
                totalUnreadMessages: Math.floor(Math.random() * 10)
            }
            return participantResponse;
        }));
    }

    /*
   listFriends(): Observable<ParticipantResponse[]> {
    // List connected users to show in the friends list
    // Sending the userId from the request body as this is just a demo 
    
    return this.http
      .post(`${fhAdapter.serverBaseUrl}`, { employeeID: this.username })
      .pipe(map((res: any) => res.data),
        catchError((error: any) => Observable.throw(error.error || 'Server error'))
      );
  }


listFriends(): Observable<ParticipantResponse[]> {
    // List connected users to show in the friends list
    // Sending the userId from the request body as this is just a demo 
    
    return this.http
      .post(`${fhAdapter.serverBaseUrl}`, { employeeID: this.username })
      .pipe(map((res: any) => res.data),
        catchError((error: any) => Observable.throw(error.error || 'Server error'))
      );
  }
  */
  /*
  transformationMethod(res){ 
     Object.keys(res.data).forEach(resKey => { 
      const obj = res.data[resKey]; 
       obj.forEach(data => { 
          data.name = 'Fetch_' + data.name; 
       }) 
     }) 
     console.log(res);
    return res; 
  }
  
 
   */
    getMessageHistory(destinataryId: any): Observable<Message[]> {
        let mockedHistory: Array<Message>;

        mockedHistory = [];

        return of(mockedHistory).pipe(delay(2000));
    }
   
    sendMessage(message: Message): void {
        setTimeout(() => {
            let replyMessage = new Message();

           //  replyMessage.message = "You have typed '" + message.message + "'";
           //  replyMessage.dateSent = new Date();

            console.log(message.toId);

            if (isNaN(message.toId))
            {
                console.log('group');
                let group = fhAdapter.mockedParticipants.find(x => x.id == message.toId) as Group;

                // Message to a group. Pick up any participant for this
                let randomParticipantIndex = Math.floor(Math.random() * group.chattingTo.length);
                replyMessage.fromId = group.chattingTo[randomParticipantIndex].id;

                replyMessage.toId = message.toId;

                this.onMessageReceived(group, replyMessage);
            }
            else
            {
                console.log('user');
                replyMessage.fromId = message.toId;
                replyMessage.toId = message.fromId;

                let user = fhAdapter.mockedParticipants.find(x => x.id == replyMessage.fromId);
                console.log(user);
                this.onMessageReceived(user, replyMessage);
            }
        }, 1000);
    }

    groupCreated(group: Group): void {
        fhAdapter.mockedParticipants.push(group);

        fhAdapter.mockedParticipants = fhAdapter.mockedParticipants.sort((first, second) =>
            second.displayName > first.displayName ? -1 : 1
        );

        // Trigger update of friends list
        this.listFriends().subscribe(response => {
            this.onFriendsListChanged(response);
        });
    }
}