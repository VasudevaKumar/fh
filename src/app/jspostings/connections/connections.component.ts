import { Component, OnInit , AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from './../../../../_services/employee.service';
import { NgxSpinnerService } from "ngx-spinner";

declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.css']
})
export class ConnectionsComponent implements OnInit {
  loggedInEmployeeID:any;
  currentUser:any;

  connectPeople=[];
  totalConnects = [];
  allGroups = [];
  myconnects = [];

  filterConnectPeople=[];
  filterAllGroups = [];
  filterMyconnects = [];





  GroupsForm: FormGroup;
  HashTagForm:FormGroup;

  hashtagMsg = '';
  hashtagValue = '';
  searchString = '';
  isContentLoaded = false;
  public isHashTagAvailable = true;
  public isLoaderRequired: boolean = false;

  submitted = false;
  constructor(
    private router: Router,
    private EmployeeService_:EmployeeService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService

    
) {
    // redirect to home if already logged in
}

  ngOnInit(): void {
    this.spinner.show();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loggedInEmployeeID  = this.currentUser[0].user_id;
    this.loadContent(this.loggedInEmployeeID);

     this.GroupsForm = this.formBuilder.group({
       addGroup: ['',
          [
              Validators.required,
              Validators.pattern(/^([a-zA-Z]+\s)*[a-zA-Z]+$/)
              
          ]
      ]
     });

     this.HashTagForm = this.formBuilder.group({
      addHashtag: ['',
         [
             Validators.required,
             Validators.pattern(/^#\w+$/)
             
         ]
     ]
    });


  }

  get f() { return this.GroupsForm.controls; }
  get h() { return this.HashTagForm.controls; }
  
  onSubmit() {
    $("#groupExisted").hide();
    this.submitted = true;

    if (this.GroupsForm.invalid) {
      // console.log('invalid');
     return;
  }

  const formData = new FormData();
  formData.append('addForm', this.GroupsForm.value.addGroup);
  formData.append('loggedInEmployeeID', this.loggedInEmployeeID);

  const _that = this;
            this.EmployeeService_
            .addGroup(formData)
            .subscribe((data) => {

                // console.log(data);
                // console.log(data.data);
                // console.log(data.data.msg);


                 if(data.data.msg == 'fail')
                 {
                //   console.log('my google');
                    $("#groupExisted").show();
                 }
                 else {
                  this.EmployeeService_.gettotalGroups(this.loggedInEmployeeID)
                  .subscribe(allGroups => (_that.allGroups = allGroups));
                 }
             
              });
  }

  hideMessage(divID)
  {
    $("#"+divID).hide();
  }
  onHashTagSubmit() {
   
    this.submitted = true;
    if (this.HashTagForm.invalid) {
      // console.log('invalid');
     return;
  }

  const formData = new FormData();
  formData.append('hashTag', this.HashTagForm.value.addHashtag);
  formData.append('loggedInEmployeeID', this.loggedInEmployeeID);

  const _that = this;
            this.EmployeeService_
            .addHashTag(formData)
            .subscribe((resp) => {
              });
  }


  async loadContent(employeeID)
    {
      const _that = this;
      const res1 = this.EmployeeService_.getConnectPageInfo(employeeID).toPromise();
      /*const res1 = this.EmployeeService_.getConnectPeople(employeeID).toPromise();
      const res2 = this.EmployeeService_.gettotalConnects(employeeID).toPromise();
      const res3 = this.EmployeeService_.gettotalGroups(employeeID).toPromise();
      const res4 = this.EmployeeService_.getMyConnects(employeeID).toPromise();
      */


      let res = await Promise.all([res1]);
      //let res = await Promise.all([res1, res4]);
      _that.connectPeople = res[0]['ConnectPeople'];
      _that.totalConnects = res[0]['totalConnects'];
      _that.allGroups = res[0]['totalGroups'];
      _that.myconnects = res[0]['myConnects'];

      _that.filterConnectPeople=_that.connectPeople;
      _that.filterAllGroups = _that.allGroups;
      _that.filterMyconnects =_that.myconnects;

      console.log( _that.filterConnectPeople);
      this.isContentLoaded = true;
     // this.spinner.hide();

    }


    connectme(user_id , loopid)
    { 
      $('#overlay').fadeIn();
      this.isLoaderRequired = true;
       const _that = this;
       this.EmployeeService_
     .connectme(user_id , this.loggedInEmployeeID)
     .subscribe((resp) => {})
     .add(() => {
      this.isLoaderRequired = false;
      $('#overlay').fadeOut();
      $("#btn_"+loopid).html('Request sent');
      $("#btn_"+loopid).prop('disabled', true);
     });

    }

    followMe(user_id , loopid)
    {
      this.isLoaderRequired = true;
      $('#overlay').fadeIn();
       const _that = this;
       this.EmployeeService_
     .followMe(user_id , this.loggedInEmployeeID)
     .subscribe((resp) => {})
     .add(() => {
      $('#overlay').fadeOut();
      this.isLoaderRequired = false;
      $("#flbtn_"+loopid).html('<i class="feather-user-plus"></i> Following');
      $("#flbtn_"+loopid).prop('disabled', true);
     });

    }

    openwaitdialog(loadingMessage: any = 'Loading', defaultWidth: any = 350) {
      // tslint:disable-next-line: max-line-length
      $('#waitDialog').html('<div>' + loadingMessage + ', please wait...</div>');
      $('#waitDialog').dialog({
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
    closewaitdialog() {
      setTimeout(function(){
          $('#waitDialog').dialog('close');
      }, 100);
      
    }

    addMeToGroup(group_id , loopid)
    { 
      this.isLoaderRequired = true;
      $('#overlay').fadeIn();
       const _that = this;
       this.EmployeeService_
     .addMeToGroup(group_id , this.loggedInEmployeeID)
     .subscribe((resp) => {})
     .add(() => {
      $('#overlay').fadeOut();
      this.isLoaderRequired = false;
      $("#addGroupbtn_"+loopid).html('Added to group');
      $("#addGroupbtn_"+loopid).prop('disabled', true);
     });

    }

    verifyHashTag(hasTagValue)
    {
      this.isHashTagAvailable = true;
      this.isLoaderRequired = true;
      $('#overlay').fadeIn();

      const _that = this;
       this.EmployeeService_
     .verifyHashTag(hasTagValue)
     .subscribe((resp) => {
     // console.log(resp); 
     // console.log(resp.data);

      if(resp.data.length > 0)
      {
        this.hashtagMsg = this.HashTagForm.value.addHashtag+' is not available';
        this.hashtagValue = '';
        this.isHashTagAvailable = false;
      }

     })
     .add(() => {
      $('#overlay').fadeOut();
      this.isLoaderRequired = false;
    });


    }

    filterConnects()
    {
      let searchJobString = $("#searchString").val().toLowerCase();

      // _that.filterConnectPeople=_that.connectPeople;
      // _that.filterAllGroups = _that.allGroups;
      // _that.filterMyconnects =_that.myconnects;

      
      this.filterConnectPeople = this.connectPeople;
      this.filterMyconnects = this.myconnects;
      this.filterAllGroups = this.allGroups;

      
      if(searchJobString!='')
      {
        this.filterConnectPeople = this.filterConnectPeople.filter( ({ connections }) => connections.firstName.toLowerCase().includes(searchJobString));
        this.filterMyconnects = this.filterMyconnects.filter( ({ firstName }) => firstName.toLowerCase().includes(searchJobString));
        this.filterAllGroups = this.filterAllGroups.filter( ({ firstName }) => firstName.toLowerCase().includes(searchJobString));

      }
      else
      {
        this.filterConnectPeople = this.connectPeople;
        this.filterMyconnects = this.myconnects;
        this.filterAllGroups = this.allGroups;

      }

    }

    showProfile(userID)
    {
      // this.router.navigate(['/profile/myProfile']);
      localStorage.setItem('searchUser', userID);
      this.router.navigate(['/jsregister/profile']);
    }
    ngAfterViewChecked(){
      if(this.isContentLoaded)
      {
         this.spinner.hide();
      }

    }
}
