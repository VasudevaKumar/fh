import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router , ActivatedRoute, Params } from '@angular/router';
import { first } from 'rxjs/operators';
import { HrserviceService } from './../../../../_services/hrservice.service';

import { NgxSpinnerService } from "ngx-spinner";
import { AlertsService } from 'angular-alert-module';
import { Subscription } from 'rxjs';


declare var jQuery: any;
declare var $: any;



@Component({
  selector: 'app-viewjob',
  templateUrl: './viewjob.component.html',
  styleUrls: ['./viewjob.component.css'],
  providers: [HrserviceService]
})
export class ViewjobComponent implements OnInit {
  selectedJobPosting: any[];
  userSubscription: Subscription;
  public currentUser:any;
  loggedInEmployeeID:any;
  
  loading = false;
  submitted = false;
  htmlContent = '';
  rowID:any;
  isContentLoaded:boolean = false;

  employeeProfiles:Array<any>;


  constructor( private formBuilder: FormBuilder,
    private router: Router,
    private HrserviceService_:HrserviceService,
    private spinner: NgxSpinnerService,
    private alerts: AlertsService,
    private route: ActivatedRoute
    
    ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loggedInEmployeeID  = this.currentUser[0].user_id;
   //  this.getEmployeeProfile(this.loggedInEmployeeID);

    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {
           //------ some code -----
          this.rowID = this.route.snapshot.params.id;
          this.getJobPostingsByID(this.loggedInEmployeeID , this.rowID);
    })
    
  }

  getJobPostingsByID(employeeID , rowID)
  {
    const _that = this;
    this.HrserviceService_
    .getJobPostingsByID(employeeID , rowID)
    .subscribe(selectedJobPosting => (_that.selectedJobPosting = selectedJobPosting))
    .add(() => {
      _that.getEmployeeProfile(employeeID);
      
    });
  } 

  public getEmployeeProfile(employeeID)
    {
        const _that = this;
        this.HrserviceService_
      .getEmployeeProfile(employeeID)
      .subscribe(employeeProfiles => (_that.employeeProfiles = employeeProfiles))
      .add(() => {
        /*console.log(_that.employeeProfiles['profileData'][0].firstName);*/
        this.isContentLoaded = true;
        this.spinner.hide();
      });

    }

}
