import { Component, OnInit , Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router , ActivatedRoute, Params } from '@angular/router';
import { first } from 'rxjs/operators';

import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { HrserviceService } from './../../../_services/hrservice.service';
import { NgxSpinnerService } from "ngx-spinner";
import { AlertsService } from 'angular-alert-module';
import { ConfirmationDialogService } from './../confirmation-dialog-component/confirmation-dialog-service';
import { Subscription } from 'rxjs';

declare var $: any;


@Component({
  selector: 'app-hrpostings',
  templateUrl: './hrpostings.component.html',
  styleUrls: ['./hrpostings.component.css'],
  providers: [HrserviceService, ConfirmationDialogService]
})
export class HrpostingsComponent implements OnInit {

  loggedInEmployeeID:any;
  jobPostings:Array<any>;
  selectedJobPosting=[];
  
  public currentUser:any;
  public isGridDataReady = false;
  public totalPostings = 10;
  public usedPostings = 0;
  public remainingPostings = 0;
  public activePostings = 0;
  public pausedPostings = 0;

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
  
  public positionSearch = 'All';
  public statusSearch = 'All';
  public searchProfiles = '0';
  public positionSearchString : any;
  public statusSearchString:any;
  public positionList:Array<any>;
  public statusList:Array<any>;
  public isDataLoaded = false;

  constructor( private formBuilder: FormBuilder,
    private router: Router,
    private HrserviceService_:HrserviceService,
    private spinner: NgxSpinnerService,
    private alerts: AlertsService,
    private confirmationDialogService: ConfirmationDialogService,
    private route: ActivatedRoute,

    ) { }

  ngOnInit(): void {
   this.spinner.show();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loggedInEmployeeID  = this.currentUser[0].user_id;
    this.getAllJobPostings(this.loggedInEmployeeID);

    this.positionSearchString = 'Position: '+this.positionSearch;
    this.statusSearchString = 'Status: '+this.statusSearch;

   }
   generateGrid()
   {
    const _that = this;
    this.columnDefs = [
      {
        headerName: 'Looking For',
        width: 150,
        field: 'lookingFor',
        sortable: true,
        filter: true,
        pinned: 'left',
        resizable: true
      },
      {
        headerName: 'Job Location',
        width: 150,
        field: 'jobLocation',
        sortable: true,
        filter: true,
        resizable: true,
        pinned: 'left'
      },
      {
        headerName: 'Min. Years',
        width: 100,
        field: 'yearMin',
        sortable: true,
        filter: 'agNumberColumnFilter',
        resizable: true
      },
      {
        headerName: 'Max. Years',
        width: 100,
        field: 'yearMax',
        sortable: true,
        filter: 'agNumberColumnFilter',
        resizable: true
      },
      {
        headerName: 'Min. Salary',
        width: 100,
        field: 'salMin',
        sortable: true,
        filter: 'agNumberColumnFilter',
        resizable: true
      },
      {
        headerName: 'Max. Salary',
        width: 100,
        field: 'salMax',
        sortable: true,
        filter: 'agNumberColumnFilter',
        resizable: true
      },
      {
        headerName: 'Job Role',
        width: 150,
        field: 'jobRole',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Industry Type',
        width: 150,
        field: 'industryType',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Functional Area',
        width: 150,
        field: 'functionalArea',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Employment Type',
        width: 150,
        field: 'employmentType',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Role Category',
        width: 150,
        field: 'roleCategory',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Created At',
        width: 150,
        field: 'created_at',
        resizable: true
      },
      {
        headerName: 'Status',
        width: 75,
        field: 'status',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        headerName: 'Action',
        width: 170,
        field: '',
        sortable: true,
        filter: true,
        resizable: true,
        cellRenderer: function (params) {
          const mainDiv = document.createElement('div');
          const pauseDiv = document.createElement('div');
          const activeDiv = document.createElement('div');
          const editDiv = document.createElement('div');
          const viewDiv = document.createElement('div');
          const deleteDiv = document.createElement('div');

          mainDiv.setAttribute('style', 'width:100%; text-align:center;');
          mainDiv.setAttribute('class', 'fa-sm');

          editDiv.setAttribute('style', 'float:left; cursor:pointer;');
          editDiv.innerHTML  = '<i class="fa fa-pencil-square fa-1x" aria-hidden="true" title="Edit"></i>';
          editDiv.addEventListener('click', () => {
            _that.openConfirmationDialog(_that.loggedInEmployeeID , params.node.data.id, 'E', 'Do you really want to edit this ?')
          });
          mainDiv.appendChild(editDiv);

          viewDiv.setAttribute('style', 'float:left; cursor:pointer; margin-left:15px;');
          viewDiv.innerHTML  = '<i class="fa fa-eye-slash fa-1x" aria-hidden="true" title="View"></i>';
          viewDiv.addEventListener('click', () => {
            _that.viewPosting(_that.loggedInEmployeeID , params.node.data.id)
          });
          mainDiv.appendChild(viewDiv);

          pauseDiv.setAttribute('style', 'float:left; cursor:pointer; margin-left:15px;');
          pauseDiv.innerHTML  = '<i class="fa fa-pause-circle fa-1x" aria-hidden="true" title="Pause"></i>';
          pauseDiv.addEventListener('click', () => {
            _that.openConfirmationDialog(_that.loggedInEmployeeID , params.node.data.id, 'P', 'Do you really want to pause this ?')
          });

          if(params.node.data.status != 'Paused')
          {
            mainDiv.appendChild(pauseDiv);
          }

          activeDiv.setAttribute('style', 'float:left; cursor:pointer; margin-left:15px;');
          activeDiv.innerHTML  = '<i class="fa fa-check-circle fa-1x" aria-hidden="true" title="Activate"></i>';
          activeDiv.addEventListener('click', () => {
            _that.openConfirmationDialog(_that.loggedInEmployeeID , params.node.data.id, 'A', 'Do you really want to activate this ?')
          });
          if(params.node.data.status != 'Active')
          {
            mainDiv.appendChild(activeDiv);
          }

          deleteDiv.setAttribute('style', 'float:left; cursor:pointer; margin-left:15px;');
          deleteDiv.innerHTML  = '<i class="fa fa-minus-circle fa-1x" aria-hidden="true" title="Delete"></i>';
          deleteDiv.addEventListener('click', () => {
            _that.openConfirmationDialog(_that.loggedInEmployeeID , params.node.data.id, 'D', 'Do you really want to delete this ?')
          });
          mainDiv.appendChild(deleteDiv);
          return mainDiv;


        }
      },
      {
        headerName: 'Job Profiles',
        width: 150,
        sortable: true,
        filter: true,
        resizable: true,
        cellRenderer: function (params) {
          const mainDiv = document.createElement('div');
          const filesDiv = document.createElement('div');
          const shortlistDiv = document.createElement('div');
          const rejectDiv = document.createElement('div');

          mainDiv.setAttribute('style', 'width:100%; text-align:center;');
          mainDiv.setAttribute('class', 'fa-sm');

          filesDiv.setAttribute('style', 'float:left; cursor:pointer;');
          filesDiv.innerHTML  = '<i class="fa fa-user fa-1x" aria-hidden="true" title="All Profiles"></i>&nbsp;<span style="font-size:10px;">('+params.node.data.listingCount+')</span>';
          filesDiv.addEventListener('click', () => {
            _that.joblisting(_that.loggedInEmployeeID , params.node.data.id)
          });

          shortlistDiv.setAttribute('style', 'float:left; cursor:pointer; margin-left:5px;');
          shortlistDiv.innerHTML  = '<i class="fa fa-check" aria-hidden="true" title="Shortlisted Profiles"></i>&nbsp;<span style="font-size:10px;">('+params.node.data.shortListCount+')</span>';
          shortlistDiv.addEventListener('click', () => {
            _that.searchProfiles = '5';
             _that.joblisting(_that.loggedInEmployeeID , params.node.data.id)
          });

          rejectDiv.setAttribute('style', 'float:left; cursor:pointer; margin-left:5px;');
          rejectDiv.innerHTML  = '<i class="fa fa-close" aria-hidden="true" title="Rejected Profiles"></i>&nbsp;<span style="font-size:10px;">('+params.node.data.rejectCount+')</span>';
          rejectDiv.addEventListener('click', () => {
            _that.searchProfiles = '6';
            _that.joblisting(_that.loggedInEmployeeID , params.node.data.id)
          });


          mainDiv.appendChild(filesDiv);
          mainDiv.appendChild(shortlistDiv);
          mainDiv.appendChild(rejectDiv);
          return mainDiv;

        }
        
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

   getAllJobPostings(employeeID)
   {
    const _that = this;
    this.HrserviceService_
    .getAllJobPostings(employeeID)
    .subscribe(rowData => (_that.rowData = rowData))
    .add(() => {
      
      // this.generateGrid();
      this.isGridDataReady = true;
      this.usedPostings = this.rowData.length;
      this.remainingPostings = (this.totalPostings)-(this.usedPostings);
      this.activePostings = this.rowData.filter(function(x){ return x.status == 'Active';}).length;
      this.pausedPostings = this.rowData.filter(function(x){ return x.status == 'Paused';}).length;
      // console.log(this.rowData);
      this.jobPostings = this.rowData;
      this.filterGridRows();
      this.isDataLoaded = true;
      //console.log(this.jobPostings);
      this.spinner.hide();
    });
   }
   onGridReady(params) {
   this.gridApi = params.api;
   this.gridColumnApi = params.columnApi;
   $('#myGrid').height($(window).height() - 100);
  }

  postAJob()
  {
   //  window.location.href = '/employee/postJob';
      this.router.navigate(['/hrpostings/postJob']);
  }


  statusChange(loggedInEmployee , id , status)
  {

    this.spinner.show();
    /*
    alert(loggedInEmployee);
    alert(id);
    alert(status);
    */

    if(status == 'E')
    {
      this.editJobPost(loggedInEmployee , id);
    }else {
        this.HrserviceService_
              .statusChange(loggedInEmployee, id , status)
              .subscribe()
              .add(() => {
                this.getAllJobPostings(loggedInEmployee);
                this.spinner.hide();
              });
    }

      
  }
  public openConfirmationDialog(loggedInEmployee , id , status , message) {
   
    this.confirmationDialogService.confirm('Please confirm..', message)
    .then((confirmed) => {if(confirmed){this.statusChange(loggedInEmployee , id , status)}})
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  gridFilter(searchString:any, searchType:any)
  {
    if(searchType == 'position')
    {
      this.positionSearch = searchString;
      this.positionSearchString = 'Position: '+this.positionSearch;
    }

    if(searchType == 'status')
    {
      this.statusSearch = searchString;
      this.statusSearchString = 'Status: '+this.statusSearch;
    }

    this.filterGridRows();

  }
  filterGridRows()
  {
    if(this.positionSearch == 'All' && this.statusSearch == 'All')
    {
      this.rowData = [];
      this.rowData = this.jobPostings;
    }
    else if(this.positionSearch != 'All' && this.statusSearch != 'All')
    {
      this.rowData = [];
      this.rowData = this.jobPostings.filter( ({ jobRole }) => jobRole === this.positionSearch );
      this.rowData = this.rowData.filter( ({ status }) => status === this.statusSearch );

    }
    else if(this.positionSearch == 'All' && this.statusSearch != 'All')
    {
      this.rowData = [];
      this.rowData = this.jobPostings;
      this.rowData = this.rowData.filter( ({ status }) => status === this.statusSearch );
    }
    else if(this.positionSearch != 'All' && this.statusSearch == 'All')
    {
      this.rowData = [];
      this.rowData = this.jobPostings;
      this.rowData = this.jobPostings.filter( ({ jobRole }) => jobRole === this.positionSearch );
    }
    else
    {
      this.rowData = [];
      this.rowData = this.jobPostings;
    }
    
    // console.log(this.positionSearch);
    // console.log(this.rowData);
    this.generateDropdowns();
    this.generateGrid();
  }
  generateDropdowns()
  {
    // positionList:Array<any>;
    // statusList:Array<any>;
    this.positionList = this.jobPostings.map(item => item.jobRole)
        .filter((value, index, self) => self.indexOf(value) === index);
    this.statusList = this.jobPostings.map(item => item.status)
        .filter((value, index, self) => self.indexOf(value) === index);

        
    // console.log(this.positionList);
  }
  viewPosting(employeeID , rowID)
  {
    this.selectedJobPosting = [];
    this.selectedJobPosting = this.rowData.find( ({ id }) => id === rowID );
    this.router.navigate(['/hrpostings/viewJob/'+rowID]);

    /*
    console.log(this.selectedJobPosting);

      let _that = this;
      $('#viewdialog').dialog({
        modal: true,
        title: 'Job posting view',
        width: 1000,
        height: 600,
        zIndex: 10000,
        resizable: false,
        buttons: {
        'Close': function() {
                // Save code here
                $('#viewdialog').dialog('close');
          }
      },
      close: function() {
        // _that.submitForm('left');
      }
    });
    */

  }
  
  editJobPost(employeeID , rowID)
  {
    this.selectedJobPosting = [];
    this.selectedJobPosting = this.rowData.find( ({ id }) => id === rowID );
    // window.location.href = '/employee/editJob/'+rowID;
    this.router.navigate(['/hrpostings/editJob/'+rowID]);
  }

  joblisting(employeeID , rowID)
  {
    localStorage.removeItem('searchProfiles');
    localStorage.setItem('searchProfiles', this.searchProfiles);
    // window.location.href = '/employee/joblisting/'+rowID;
    this.router.navigate(['/hrpostings/userprofile/'+rowID]);
  }

}
