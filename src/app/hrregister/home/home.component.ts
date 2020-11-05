import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ConfirmPasswordValidator } from './../../../../_validators/confirm-password.validator';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { CommonService } from './../../../../_services/common.service';
import { RegisterService } from './../../../../_services/register.service';
import { HrserviceService } from './../../../../_services/hrservice.service';

import { NgxSpinnerService } from "ngx-spinner";
import { AlertsService } from 'angular-alert-module';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ImageCroppedEvent } from 'ngx-image-cropper';


declare var jQuery: any;
declare var $: any;




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [CommonService , RegisterService , HrserviceService]
})
export class HomeComponent implements OnInit {
  loggedInEmployeeID:any;
  employeeProfiles:Array<any>;
  similarCompanyProfiles:Array<any>;
  companyUpdates:Array<any>;
  companyCareers:Array<any>;
  activeJobPostings:Array<any>;

  imageChangedEvent: any = '';
  imageChangedEventR:any = '';
  croppedImage: any = '';
  HomPageForm: FormGroup;

  public currentUser:any;
  imageSrc: string;
  isEmployeeProfileLoaded = false;
  isContentLoaded = false;
  ImageSizeerror:boolean = false;
  ImageTypeeerror:boolean = false;
  fileToReturn:any;
  data:any;
  imageSrcLeft: string;
  loggedInCompanyID:any;
  isHomePicUploaing:boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private CommonService_:CommonService,
    private RegisterService_:RegisterService,
    private HrserviceService_:HrserviceService,
    private spinner: NgxSpinnerService,
    private alerts: AlertsService
   
) {
    // redirect to home if already logged in
}

  ngOnInit(): void {
    this.spinner.show();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // console.log(this.currentUser);
    
     this.loggedInEmployeeID  = this.currentUser[0].user_id;
       // this.loggedInEmployeeID  = 13
       this.getEmployeeProfile(this.loggedInEmployeeID);

       this.HomPageForm = this.formBuilder.group({
        leftSideFile: [],
        leftSidefileSource:[]
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
          // console.log(_that.employeeProfiles);
          localStorage.setItem('companyID', this.employeeProfiles[0]['companyID']);
          if(this.employeeProfiles.length > 0)
          {
            this.imageSrcLeft = this.employeeProfiles[0]['companyProfilePicture'];
          }
          this.isEmployeeProfileLoaded = true;
          this.loggedInCompanyID = this.employeeProfiles[0]['companyID'];

          this.loadCompanyContent(this.loggedInCompanyID);

      });

    }
    async loadCompanyContent(employeeID) {
     
      let keyword = this.getFirstWord(this.employeeProfiles[0].Industry);
     // const similarProfiles = this.HrserviceService_.getSimilarCompanyProfiles(employeeID, keyword).toPromise();
     // const updates = this.HrserviceService_.companyUpdates(employeeID).toPromise();
     // const careers = this.HrserviceService_.companyCareers(employeeID).toPromise();
     // const activeJobs = this.HrserviceService_.getActiveJobs(employeeID).toPromise();

      const companyContent = this.HrserviceService_.getCompanyHomePageDetails(employeeID, keyword).toPromise();

      let res = await Promise.all([companyContent]);
      this.similarCompanyProfiles = res[0]['similarProfiles'];
      this.companyUpdates = res[0]['companyUpdates'];
      this.companyCareers = res[0]['companyCareers'];
      this.activeJobPostings = res[0]['activeJobs'];
      
      this.isContentLoaded = true;
      // console.log(this.companyUpdates);
     // console.log(this.companyCareers);
      this.spinner.hide();

    }
    /*
    getSimilarCompanyProfiles(employeeID)
    {
      const _that = this;
      let keyword = this.getFirstWord(this.employeeProfiles[0].Industry);
      this.HrserviceService_
    .getSimilarCompanyProfiles(employeeID , keyword)
    .subscribe(similarCompanyProfiles => (_that.similarCompanyProfiles = similarCompanyProfiles))
    .add(() => {
      this.isSimilarProfileLoaded = true;
      this.spinner.hide();
    });

    }
    */

    gotoWebSite()
    {
      var url = "http://"+this.employeeProfiles[0]['website'];
      window.open(url , "_blank");
    }

     getFirstWord(str) {
      let spaceIndex = str.indexOf(' ');
      return spaceIndex === -1 ? str : str.substr(0, spaceIndex);
      }

     pushUpdates(commentNotes, event)
    {
      
      this.companyUpdates.unshift({
        message: commentNotes,
        companyLogo:this.employeeProfiles[0]['companyLogo'],
        companyName:this.employeeProfiles[0]['companyName'],
        contactPersonDesignation:this.employeeProfiles[0]['contactPersonDesignation'],
        contactPersonName:this.employeeProfiles[0]['contactPersonName'],
        created_at:new Date()
      });
  
      
      this.HrserviceService_.pushUpdates(this.loggedInCompanyID , commentNotes).toPromise();
      this.clearValue(event);

    }

    pushCareer(careerDetail , event)
    {
     
      this.companyCareers.unshift({
      careerDeatils:careerDetail,
      created_at:new Date()
      });

      this.HrserviceService_.pushCareer(this.loggedInCompanyID , careerDetail).toPromise();
      this.clearValue(event);
      

    }

    clearValue(event)
    {
      event.target.value='';
    }


    fn_leftSidePrfilePic()
    {
       document.getElementById('leftSideFile').click();
    }

    onLeftSidePicChange(event: any): void {
      this.openDialogL();
      this.imageChangedEvent = event;
    }

    imageCroppedL(event: ImageCroppedEvent) {
      this.imageSrcLeft = event.base64;
      this.fileToReturn = this.base64ToFile(
      event.base64,
      this.imageChangedEvent.target.files[0].name,
    )
      this.HomPageForm.patchValue({
      leftSidefileSource: this.fileToReturn
    });
    }
    imageLoadedL() {
      // show cropper
    }
    cropperReadyL() {
      // cropper ready
    }
    loadImageFailedL() {
      // show message
    }



    openDialogL()
    {
      let _that = this;
      $('#imageCropDailogL').dialog({
        modal: true,
        title: 'Crop your image',
        width: 1350,
        height: 600,
        zIndex: 10000,
        resizable: false,
        buttons: {
        'Save': function() {
                // Save code here
                $('#imageCropDailogL').dialog('close');
                _that.submitForm();
          }
      },
      close: function() {
        // _that.submitForm('left');
      }
    });
    }


    base64ToFile(data, filename) {

      const arr = data.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
    
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
    
      return new File([u8arr], filename, { type: mime });
    }

    submitForm(){
      this.isHomePicUploaing = true;
      $('#overlay').fadeIn();
        const formData = new FormData();
        formData.append('leftSidefileSource', this.HomPageForm.value.leftSidefileSource);  
        formData.append('loggedInUser', this.loggedInEmployeeID);      
      //   formData.append('leftSidefile', this.HomPageForm.get('leftSidefileSource').value);
        const _that = this;
              this.HrserviceService_
              .uploadHomePageFileL(formData)
              .subscribe((resp) => {
                //console.log(resp);
              })
              .add(() => {
                //  this.spinner.hide();
                this.isHomePicUploaing = false;
                $('#overlay').fadeOut();
               });;

    }

    deleteProfilePic()
      {
        this.isHomePicUploaing = true;
        $('#overlay').fadeIn();
        this.imageSrcLeft = '';
        const _that = this;
          this.HrserviceService_.deleteProfilePic(this.loggedInEmployeeID)
          .subscribe()
          .add(() => {
            this.isHomePicUploaing = false;
            $('#overlay').fadeOut();
            });
      }

}
