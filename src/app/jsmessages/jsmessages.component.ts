import { Component, OnInit, TemplateRef,AfterViewChecked  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from './../../../_services/employee.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";




declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-jsmessages',
  templateUrl: './jsmessages.component.html',
  styleUrls: ['./jsmessages.component.css']
})
export class JsmessagesComponent implements OnInit {

  latestChatMessages = [];
  chatDetailMessages = [];
  chatDetails = [];

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
    this.clearPendingChatMessages(this.loggedInEmployeeID);
    this.getLatestChatMessages(this.loggedInEmployeeID);
    // console.log(this.loggedInEmployeeID);
    
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

}
