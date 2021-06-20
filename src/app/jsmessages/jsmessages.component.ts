import { Component, OnInit, TemplateRef,AfterViewChecked  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from './../../../_services/employee.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { Subscription, timer , interval} from 'rxjs';



declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-jsmessages',
  templateUrl: './jsmessages.component.html',
  styleUrls: ['./jsmessages.component.css']
})
export class JsmessagesComponent implements OnInit {

  subscription: Subscription;
  latestChatMessages = [];
  chatDetailMessages = [];
  chatDetails = [];

  latestChatMessages_Interval = [];
  chatDetails_Interval = [];

  loggedInEmployeeID:any;
  loggedInEmployeeName:any;
  latestSendToId:any;
  sendToEmployeeName=[];
  currentSendTo:any;
  currentUser:any;
  isChatDataLoaded = false;
  public isHomePicUploaing:boolean = false;
  public replyMsg = '';
  public isPostEmpty:boolean = false;
  employeeFilter: any = { employeeName : '' };
  public lastPostDate:any  = new Date();


  constructor(
    private router: Router,
    private EmployeeService_:EmployeeService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
    
  ) { }

  ngOnInit(): void {
    
    this.spinner.show();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loggedInEmployeeID  = this.currentUser[0].user_id;
        // console.log(this.loggedInEmployeeID);
    this.clearPendingChatMessages(this.loggedInEmployeeID);
    this.getLatestChatMessages(this.loggedInEmployeeID);

    this.lastPostDate.setSeconds(0, 0);
    this.lastPostDate = this.lastPostDate.toISOString().replace(/T/, " ").replace(/:00.000Z/, "");


    this.subscription= interval(60000).subscribe((x =>{
      this.getIntervalLatestChatMessages(this.loggedInEmployeeID);
    }));

   
  }

  clearPendingChatMessages(employeeID)
  {
    const _that = this;
        this.EmployeeService_
      .clearPendingChatMessages(employeeID)
      .subscribe()
  }

  getLatestChatMessages(employeeID)
  {
      const _that = this;
        this.EmployeeService_
      .getLatestChatMessages(employeeID)
      .subscribe(latestChatMessages => (_that.latestChatMessages = latestChatMessages))
      .add(() => {
        /*console.log(_that.employeeProfiles['profileData'][0].firstName);*/
       // console.log(_that.employeeProfiles);
       if(_that.latestChatMessages.length >0)
       {
        _that.latestSendToId = _that.latestChatMessages[0]['id'];
        _that.getAllChatMessages(employeeID,_that.latestSendToId);
       }
       else{
        this.spinner.hide();
       }
      });
  }


  getAllChatMessages(employeeID,latestSendToId)
  {
    this.isHomePicUploaing = true;
    $('#overlay').fadeIn();
    const _that = this;
    _that.currentSendTo =latestSendToId;
        this.EmployeeService_
      .getAllChatMessages(employeeID, latestSendToId)
      .subscribe(chatDetails => (_that.chatDetails = chatDetails))
      .add(() => {
        
        // _that.loggedInEmployeeName = _that.chatDetailMessages[0]['user_firstName']+' '+_that.chatDetailMessages[0]['user_lastName'];
       _that.isChatDataLoaded = true;
        _that.chatDetailMessages = _that.chatDetails['getAllChats'];
        _that.sendToEmployeeName = _that.chatDetails['getEmployeeName'];

       //  console.log(_that.chatDetailMessages);
       //  console.log(_that.sendToEmployeeName);

       this.spinner.hide();
       this.isHomePicUploaing = false;
      $('#overlay').fadeOut();
      });

  }


  getIntervalLatestChatMessages(employeeID)
  {
      const _that = this;
        this.EmployeeService_
      .getLatestChatMessages(employeeID)
      .subscribe(latestChatMessages => (_that.latestChatMessages = latestChatMessages))
      .add(() => {
        /*console.log(_that.employeeProfiles['profileData'][0].firstName);*/
       // console.log(_that.employeeProfiles);
       if(_that.latestChatMessages.length >0)
       {
        _that.latestSendToId = _that.latestChatMessages[0]['id'];
        _that.getIntervalAllChatMessages(employeeID,_that.latestSendToId);
       }
       else{
        this.spinner.hide();
       }
      });
  }


  getIntervalAllChatMessages(employeeID,latestSendToId)
  {
    
    const _that = this;
    _that.currentSendTo =latestSendToId;
        this.EmployeeService_
      .getAllChatMessages(employeeID, latestSendToId)
      .subscribe(chatDetails => (_that.chatDetails = chatDetails))
      .add(() => {
        
        // _that.loggedInEmployeeName = _that.chatDetailMessages[0]['user_firstName']+' '+_that.chatDetailMessages[0]['user_lastName'];
       _that.isChatDataLoaded = true;
        _that.chatDetailMessages = _that.chatDetails['getAllChats'];
        _that.sendToEmployeeName = _that.chatDetails['getEmployeeName'];

       //  console.log(_that.chatDetailMessages);
       //  console.log(_that.sendToEmployeeName);
      });

  }

  
  /*
  getIntervalChatMessages(employeeID)
  {
      const _that = this;
        this.EmployeeService_
      .getIntervalChatMessages(employeeID , this.lastPostDate)
      .subscribe(latestChatMessages_Interval => (_that.latestChatMessages_Interval = latestChatMessages_Interval))
      .add(() => {
       if(_that.latestChatMessages_Interval.length >0)
       {
          _that.latestSendToId = _that.latestChatMessages_Interval[0]['id'];
          _that.getIntervalMessages(employeeID,_that.latestSendToId);
        }


       
      });
  }
  getIntervalMessages(employeeID,latestSendToId)
  {
    
    const _that = this;
    _that.currentSendTo =latestSendToId;
        this.EmployeeService_
      .getIntervalMessages(employeeID, latestSendToId, this.lastPostDate)
      .subscribe(chatDetails_Interval => (_that.chatDetails_Interval = chatDetails_Interval))
      .add(() => {
        
        console.log('xxxx');
        console.log(_that.chatDetails_Interval['getAllChats']);
        console.log('yyyy');
        console.log(_that.chatDetails['getAllChats']);


        if(_that.chatDetails_Interval['getAllChats'].length >0)
        {

       _that.chatDetailMessages = _that.chatDetails_Interval['getAllChats'].concat(_that.chatDetails['getAllChats']);
       _that.lastPostDate = _that.chatDetailMessages.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
       _that.lastPostDate = _that.lastPostDate.created_at;
       _that.isChatDataLoaded = true;
        _that.sendToEmployeeName = _that.chatDetails_Interval['getEmployeeName'];

        }

      });

  }
  */
 



  refreshData(employeeID)
  {
      const _that = this;
        this.EmployeeService_
      .getLatestChatMessages(employeeID)
      .subscribe(latestChatMessages => (_that.latestChatMessages = latestChatMessages))
      .add(() => {
        /*console.log(_that.employeeProfiles['profileData'][0].firstName);*/
       // console.log(_that.employeeProfiles);
       if(_that.latestChatMessages.length >0)
       {
        _that.latestSendToId = _that.latestChatMessages[0]['id'];
       }
      });
  }


  submitReply()
  {
    const _that = this;
    
    

    if(this.replyMsg == '')
    {
      this.isPostEmpty = true;
    }
    else{
      this.isPostEmpty = false;
    }

    if(!this.isPostEmpty)
    {
 //      this.isHomePicUploaing = true;
     //  $('#overlay').fadeIn();

      const _that = this;
        this.EmployeeService_
      .submitChatReply(this.loggedInEmployeeID , this.currentSendTo, this.replyMsg)
      .subscribe(chatDetailMessages => (_that.chatDetailMessages = chatDetailMessages))
      .add(() => {
        this.replyMsg = '';
        this.refreshData(_that.loggedInEmployeeID);
        this.getAllChatMessages(_that.loggedInEmployeeID , _that.currentSendTo);

      });

    }
  }

  ngOnDestroy() {
    if(this.subscription && !this.subscription.closed)
    {
      this.subscription.unsubscribe();
    }
  }
  

}
