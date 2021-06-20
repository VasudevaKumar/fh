import { Component, OnInit , Input } from '@angular/core';
import { Router , ActivatedRoute, Params } from '@angular/router';
import { first } from 'rxjs/operators';

import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { HrserviceService } from './../../../_services/hrservice.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-fhdashboard',
  templateUrl: './fhdashboard.component.html',
  styleUrls: ['./fhdashboard.component.css'],
  providers: [HrserviceService]
})
export class FhdashboardComponent implements OnInit {

  loggedInEmployeeID:any;
  employeeProfiles:Array<any>;
  employeeCounts:Array<any>;
  public currentUser:any;
  public isGridDataReady = false;
  public role_id:any;
  public roleType_description:any;

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

  
  constructor(
    private router: Router,
    private HrserviceService_:HrserviceService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {

    this.spinner.show();
    this.role_id = 2;
    this.roleType_description = 'Job seeker profiles';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loggedInEmployeeID  = this.currentUser[0].user_id;
    this.loadCount();
    
  }
  loadCount()
  {
   const _that = this;
   this.HrserviceService_
   .loadCount()
   .subscribe(employeeCounts => (_that.employeeCounts = employeeCounts))
   .add(() => {
    //  console.log(this.employeeCounts);
    this.loadEmployeeDetails(this.role_id);
   });
  }

  loadEmployeeDetails(role_id)
  {
   const _that = this;
   this.HrserviceService_
   .loadEmployeeDetails(role_id)
   .subscribe(rowData => (_that.rowData = rowData))
   .add(() => {
     this.generateGrid();
     this.isGridDataReady = true;
     this.spinner.hide();
   });
  }
  onGridReady(params) {
  this.gridApi = params.api;
  this.gridColumnApi = params.columnApi;
  $('#myGrid').height($(window).height() - 210);
 }
 
 

 
  generateGrid()
  {
   const _that = this;
   if(this.role_id != 3)
   {
    this.columnDefs = [
      {
        headerName: 'First Name',
        field: 'firstName',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Last Name',
        field: 'lastName',
        sortable: true,
        filter: true,
        resizable: true
        
      },
      {
        headerName: 'Email Address',
        field: 'emailAddress',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Phone Number',
        field: 'primaryPhone',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Role Type',
        field: 'roleType',
        sortable: true,
        filter: true,
        width:150,
        resizable: true
      },
      {
        headerName: 'Status',
        field: 'empStatus',
        sortable: true,
        filter: true,
        width:100,
        resizable: true
      },
      {
        headerName: 'Registered date',
        field: 'created_at',
        sortable: true,
        filter: true,
        width:150,
        resizable: true
      },
      {
        headerName: 'Counts',
        field: 'cnt',
        sortable: true,
        filter: true,
        width:100,
        resizable: true
      }
  ];
}
else{

  this.columnDefs = [
    {
      headerName: 'Compnay Name',
      field: 'firstName',
      sortable: true,
      filter: true,
      resizable: true
    },
    {
      headerName: 'Contact Person',
      field: 'lastName',
      sortable: true,
      filter: true,
      resizable: true
      
    },
    {
      headerName: 'Email Address',
      field: 'emailAddress',
      sortable: true,
      filter: true,
      resizable: true
    },
    {
      headerName: 'Phone Number',
      field: 'primaryPhone',
      sortable: true,
      filter: true,
      resizable: true
    },
    {
      headerName: 'Role Type',
      field: 'roleType',
      sortable: true,
      filter: true,
      width:150,
      resizable: true
    },
    {
      headerName: 'Status',
      field: 'empStatus',
      sortable: true,
      filter: true,
      width:100,
      resizable: true
    },
    {
      headerName: 'Registered date',
      field: 'created_at',
      sortable: true,
      filter: true,
      width:150,
      resizable: true
    },
    {
      headerName: 'Counts',
      field: 'cnt',
      sortable: true,
      filter: true,
      width:100,
      resizable: true
    }
];

}
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

  viewDetails(rID)
  {
    this.role_id = rID;
    if(this.role_id == 2)
    {
      this.roleType_description = 'Job seeker profiles';
    }

    if(this.role_id == 3)
    {
      this.roleType_description = 'Company profiles';
    }

    if(this.role_id == 4)
    {
      this.roleType_description = 'Career Manager profiles';
    }



    this.spinner.show();
    this.loadCount();
  }

}
