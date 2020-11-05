import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from "@angular/common";
import { EmployeeService } from '../../../_services/employee.service';
import {InteractionService} from'../../../_services/interaction.service';

declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'facehiring-menucomponent',
  templateUrl: './menucomponent.component.html',
  styleUrls: ['./menucomponent.component.css']
})
export class MenucomponentComponent implements OnInit {

  loggedInEmployeeID:any;
  currentUser:any;
  pendingRequests = [];
  approvedRequets = [];
  notificationComments = [];
  isCommentNotificationRequired =  false;
  isMenuLinks = true;
  totalPendingCounts = 0;
  role_id:any = 0;
  

  constructor(
    private router: Router,
    location: Location,
    private EmployeeService_:EmployeeService,
    private formBuilder: FormBuilder,
    private _interactionService:InteractionService
    
) {
    
  router.events.subscribe(val => {
   // console.log(location.path());
    this.isCommentNotificationRequired = false;
    this.isMenuLinks = true;

    if(location.path() == '/jsregister/signup' || location.path() ==  'hrregister')
    {
      this.isMenuLinks = false;
    }
    if(location.path() == '/jspostings')
    {
      this.isCommentNotificationRequired = true;
      
    }
   
  });

}

  ngOnInit(): void {
    
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
   // console.log('menu');
   // console.log(this.currentUser);

    this._interactionService.teacherMessage$
    .subscribe(
      message => {
       // console.log('serview');
       // console.log(message);
        this.role_id = message;

      });

    if(this.currentUser!=null)
    {
      this.loggedInEmployeeID  = this.currentUser[0].user_id;
      this.role_id =  this.currentUser[0].role_id;
        if(this.role_id == 2)
        {
          this.getPendingRequests();
          this.getNotifications();
          this.getApprovedNotifications();  
        }
      
    }

  }

  getPendingRequests()
  {
      const _that = this;
      this.EmployeeService_
    .getPendingRequests(this.loggedInEmployeeID)
    .subscribe(pendingRequests => (_that.pendingRequests = pendingRequests))
    .add(() => {
      /*console.log(_that.employeeProfiles['profileData'][0].firstName);*/
      // console.log(_that.pendingRequests);
      this.totalPendingCounts += _that.pendingRequests.length;
    
    });
  }

  getApprovedNotifications()
  {
    const _that = this;
    this.EmployeeService_
  .getApprovedNotifications(this.loggedInEmployeeID)
  .subscribe(approvedRequets => (_that.approvedRequets = approvedRequets))
  .add(() => {
    /*console.log(_that.employeeProfiles['profileData'][0].firstName);*/
    // console.log(_that.pendingRequests);
    this.totalPendingCounts += this.approvedRequets.filter( ({ isViewed }) => isViewed == '0' ).length;

    
  
  });

  }
  acceptRequest(connectID)
  {
    // alert(connectID);
    
   this.menudialog('Your friend request has been accepted', 450);
   const _that = this;
   this.EmployeeService_
  .acceptRequest(connectID)
  .subscribe()
  .add(() => {
    /*console.log(_that.employeeProfiles['profileData'][0].firstName);*/
    setTimeout(function(){
      $('#menuWaitDialog').dialog('close');
    }, 3000);

    _that.pendingRequests = _that.pendingRequests.filter(function( obj ) {
      return obj.connectID !== connectID;
  });
  _that.totalPendingCounts = (_that.totalPendingCounts -1);
  // _that.refresh();
  });


  }

  refresh(): void {
    window.location.reload();
  }

  menudialog(loadingMessage: any = 'Loading', defaultWidth: any = 350) {
    // tslint:disable-next-line: max-line-length
    $('#menuWaitDialog').html('<div>' + loadingMessage + ', please wait...</div>');
    $('#menuWaitDialog').dialog({
     modal: true,
     // title: 'Please wait',
      zIndex: 10000,
      maxWidth: defaultWidth,
      maxHeight: 100,
      width: defaultWidth,
      height: 100,
      resizable: false,
      dialogClass: 'no-titlebar'
    });
  }
  closemenuwaitdialog() {
    setTimeout(function(){
        $('#menuWaitDialog').dialog('close');
    }, 1000);
    
  }

  logout()
  {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('companyID');
    localStorage.removeItem('appliedJob');
    localStorage.removeItem('searchUser');
    localStorage.clear();
    window.location.href = '/';
  }

  appliedJobs()
  {
    localStorage.setItem('appliedJob', 'Yes');
    this.router.navigate(['/jobSearch']);
    
  }
  allJobs()
  {
    localStorage.removeItem('appliedJob');
    this.router.navigate(['/jobSearch']);
  }
  
  getNotifications()
  {
      const _that = this;
      this.EmployeeService_
    .getNotifications(this.loggedInEmployeeID)
    .subscribe(notificationComments => (_that.notificationComments = notificationComments))
    .add(() => {
      /*console.log(_that.employeeProfiles['profileData'][0].firstName);*/
     // console.log(_that.notificationComments);
     this.totalPendingCounts += this.notificationComments.filter( ({ isViewed }) => isViewed == '0' ).length;
     

    
    });
  }
  displayMessage(ID , postID, category)
  {
    // console.log('display message');
    const _that = this;
    
    if(category == 'comments')
    {
        $('html,body').animate({
          // scrollTop: $("#fhPostID" + postID).offset().bottom
          // scrollTop: $("#commentPost_"+postID).offset().top
          scrollTop: $("#commentPost_"+postID).offset().top - $(window).height()/2
      }, 'slow');
      $("#commentPost_"+postID).show();
    }

    if(category == 'likes')
    {
        $('html,body').animate({
          // scrollTop: $("#fhPostID" + postID).offset().bottom
         // scrollTop: $("#likePost_"+postID).offset().top
          scrollTop: $("#likePost_"+postID).offset().top - $(window).height()/2
      }, 'slow');
      
    }

  }
  acceptRequestNotification(ID , postID, category,aid)
  {
    // console.log('com'+ companyID)
    const _that = this;
      /*
        $('html,body').animate({
          // scrollTop: $("#fhPostID" + postID).offset().bottom
          scrollTop: $("#commentPost_"+postID).offset().top
      }, 'slow');
      $("#commentPost_"+postID).show();
      */

     this.EmployeeService_
        .acceptRequestNotification(ID , category)
        .subscribe()
        .add(() => {
         
          /*
          _that.notificationComments = _that.notificationComments.filter(function( obj ) {
            return obj.commentID !== commentID;

        });
        */
       _that.notificationComments.find(v => v.aid === aid).isViewed = '1';

       _that.totalPendingCounts = (_that.totalPendingCounts -1);

       if(category == 'comments')
       {
           $('html,body').animate({
             // scrollTop: $("#fhPostID" + postID).offset().bottom
             // scrollTop: $("#commentPost_"+postID).offset().top
             scrollTop: $("#commentPost_"+postID).offset().top - $(window).height()/2

         }, 'slow');
         $("#commentPost_"+postID).show();
       }
   
       if(category == 'likes')
       {
           $('html,body').animate({
             // scrollTop: $("#fhPostID" + postID).offset().bottom
             // scrollTop: $("#likePost_"+postID).offset().top
             scrollTop: $("#likePost_"+postID).offset().top - $(window).height()/2
         }, 'slow');
         
       }

        });
        

  }

  acceptApproveRequest(connectID)
  {
    const _that = this;
    this.EmployeeService_
        .acceptApproveRequest(connectID)
        .subscribe()
        .add(() => {
                _that.totalPendingCounts = (_that.totalPendingCounts -1);
                });
  }

  preventDefault()
  {
    return false;
  }

  goToLandingPage(event) {
    event.preventDefault();
   // console.log('role group'+this.role_id);
    
    if(this.role_id == 2)
    {
      this.router.navigateByUrl('/', {skipLocationChange: true})
        .then(() => this.router.navigate(['/jspostings']));
    }
    if(this.role_id == 3)
    {
      this.router.navigateByUrl('/', {skipLocationChange: true})
        .then(() => this.router.navigate(['/hrregister/home']));
    }
    
  }

}
