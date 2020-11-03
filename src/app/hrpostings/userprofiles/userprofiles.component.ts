import { Component, OnInit , Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router , ActivatedRoute, Params } from '@angular/router';
import { first } from 'rxjs/operators';
import { HrserviceService } from './../../../../_services/hrservice.service';

import { NgxSpinnerService } from "ngx-spinner";
import { AlertsService } from 'angular-alert-module';
import { ConfirmationDialogService } from './../../confirmation-dialog-component/confirmation-dialog-service';
import { Subscription } from 'rxjs';

declare var $: any;



@Component({
  selector: 'app-userprofiles',
  templateUrl: './userprofiles.component.html',
  styleUrls: ['./userprofiles.component.css'],
  providers: [HrserviceService, ConfirmationDialogService]
})
export class UserprofilesComponent implements OnInit {

  loggedInEmployeeID:any;
  jobListings:Array<any>;
  public currentUser:any;
  jobID:any;
  public isGridDataReady = false;

   /* AG - Grid Variables */
  // tslint:disable-next-line: member-ordering
  public gridApi: any;
  // tslint:disable-next-line: member-ordering
  public gridColumnApi: any;
  // tslint:disable-next-line: member-ordering
  public columnDefs: any;
  // tslint:disable-next-line: member-ordering
  public components: any;
  // tslint:disable-next-line: member-ordering
  public defaultColDef: any;
  // tslint:disable-next-line: member-ordering
  public groupDefaultExpanded: any;
  // tslint:disable-next-line: member-ordering
  public rowSelection: any;
  // tslint:disable-next-line: member-ordering
  public rowData: any;
  // tslint:disable-next-line: member-ordering

  public gridOptions: any;
  userSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private HrserviceService_:HrserviceService,
    private spinner: NgxSpinnerService,
    private alerts: AlertsService,
    private confirmationDialogService: ConfirmationDialogService,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.spinner.show();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loggedInEmployeeID  = this.currentUser[0].user_id;

    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {
           //------ some code -----
          this.jobID = this.route.snapshot.params.id;
          this.getjobListings(this.loggedInEmployeeID , this.jobID);
    })


  }

  getjobListings(employeeID , jobID)
  {
      const _that = this;
          this.HrserviceService_
        .getjobListings(employeeID , jobID)
        .subscribe(rowData => (_that.rowData = rowData))
        .add(() => {
          /*console.log(_that.employeeProfiles['profileData'][0].firstName);*/
          // console.log(_that.rowData);
          this.isGridDataReady = true;
          this.generateGrid();
          this.spinner.hide();
        });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    $('#myGrid').height($(window).height() - 100);
   }

   
  generateGrid()
   {
    const _that = this;
    this.columnDefs = [
      {
        headerName: 'First Name',
        width: 150,
        field: 'firstName',
        sortable: true,
        filter: true,
        pinned: 'left',
        resizable: true
      },
      {
        headerName: 'Last Name',
        width: 150,
        field: 'lastName',
        sortable: true,
        filter: true,
        resizable: true,
        pinned: 'left'
      },
      {
        headerName: 'Email Address',
        width: 200,
        field: 'emailAddress',
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Gender',
        width: 150,
        field: 'genderName',
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Location',
        width: 150,
        field: 'locationName',
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Company Name',
        width: 150,
        field: 'companyName',
        sortable: true,
        resizable: true
      },
      {
        headerName: 'Position Name',
        width: 150,
        field: 'positionName',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Phone Number',
        width: 150,
        field: 'primaryPhone',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Alternate Phone',
        width: 150,
        field: 'alternatePhone',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Image',
        width: 150,
        field: 'imageProfile',
        sortable: true,
        filter: true,
        resizable: true
      }
      
  ];
    /*
    this.rowData = [
        { make: 'Toyota', model: 'Celica', price: 35000 },
        { make: 'Ford', model: 'Mondeo', price: 32000 },
        { make: 'Porsche', model: 'Boxter', price: 72000 }
    ];
    */

   this.defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  this.gridOptions = {
    columnDefs: this.columnDefs,
    angularCompileHeaders: true,
    rowData: null,
    overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>',
    overlayNoRowsTemplate: '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">This is a custom \'no rows\' overlay</span>'

  };

 

   }

}
