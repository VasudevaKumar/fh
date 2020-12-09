import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { CommonService } from './../../../../_services/common.service';
import { RegisterService } from './../../../../_services/register.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import months from './../../../../_helpers/months.json';
import dates from './../../../../_helpers/dates.json';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { ConfirmationDialogService } from './../../confirmation-dialog-component/confirmation-dialog-service';
import { NgxSpinnerService } from "ngx-spinner";
import { AlertsService } from 'angular-alert-module';


declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css'],
  providers: [CommonService , ConfirmationDialogService]
})
export class EditprofileComponent implements OnInit {


  EditForm: FormGroup;
  loading = false;
  submitted = false;
  locations: Array<any>;
  positions: Array<any>;
  companies: Array<any>;
  skills: Array<any>;
  genders: Array<any>;
  languages: Array<any>;
  loggedInEmployeeID: any;
  employeeProfiles: Array<any>;
  exps: Array<any>;
  edus: Array<any>;
  imageSrc: string;
  url: string;
  isLocationsLoaded = false;

  showLocationErrorMessage = false;
  showCompanyErrorMessage = false;
  showSkillErrorMessage = false;
  showPositionErrorMessage = false;
  isSkillsChecked = 'No';

  selectedLocation: any;
  selectedCompany: any;
  selectedPosition: any;

  isContentLoaded = false;

  /* Skills */
  dropdownList = [];
  selectedSkillItems = [];
  dropdownSettings = {};
  slectedSkillItemString = '';
  newResumeName = '';

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  ImageSizeerror:boolean = false;
  ImageTypeeerror:boolean = false;
  ImageRequired:boolean = false;
  ImageWidth:boolean=false;


  ResumeTypeError: boolean = false;
  isExpEdutDetailsAsigned: boolean = false;

  public isEmailAvailable = true;
  public isPhoneAvailable = true;

  currentUser: any;
  public monthLists: { id: string, name: string }[] = months;
  public dateLists: { id: string, data: any }[] = dates;
  public countExp = 1;
  public countEdu = 1;

  public maxDate: Date = new Date(); 
  public minDate: Date = new Date(1900, 0, 1);


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private alerts: AlertsService,
    private CommonService_: CommonService,
    private RegisterService_: RegisterService,
    private confirmationDialogService: ConfirmationDialogService

  ) {
    // redirect to home if already logged in
  }

  ngOnInit() {
    this.spinner.show();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loggedInEmployeeID = this.currentUser[0].user_id;
    this.myFunction();
    // this.loggedInEmployeeID  = 63;
    this.getEmployeeProfile(this.loggedInEmployeeID);

    //  this.selectedSkillItems = [];
    this.EditForm = this.formBuilder.group({

      firstName: ['',
        [
          Validators.required,
          Validators.pattern(/^([a-zA-Z]+\s)*[a-zA-Z]+$/)
        ]
      ],
      lastName: ['',
        [
          Validators.required,
          Validators.pattern(/^([a-zA-Z]+\s)*[a-zA-Z]+$/)
        ]
      ],
      birthDateMonth:
        [
          '', [Validators.required]
        ],
      birthDateDate:
        [
          '', [Validators.required]
        ],
      birthDateYear:
        [
          '', [Validators.required]
        ],
      birthDateGender:
        [
          '', [Validators.required]
        ],
      organization: ['',
        [
          Validators.pattern(/^[a-z\d\-_\s]+$/i)
        ]
      ],
      website: ['',
        [
          Validators.pattern(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/)
        ]
      ],
      /*
      phoneNumber: ['', 
              [
                  Validators.required
                 //  Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')
              ]
      ],
      altphoneNumber: [],
      */
      phoneNumber: ['', [Validators.required]],
      altphoneNumber: [],
      language:
        [
          '', [Validators.required]
        ],
      bio:
        [],
      ddlLocation:
        [
          '', [Validators.required]
        ],
      skills: [],
      file: [],
      imageProfile: [],
      InstagramLink: [],
      FacebookLink: [],
      TwitterLink: [],
      YoutubeLink: [],
      GithubLink: [],
      fileSource: [],
      resumeFileSource: [],
      fileInput: [],
      fromDate: [],
      fileInputSource: [],
      exps: this.formBuilder.array([
        //  this.formBuilder.control(null)
        // this.initDetails(this.employeeProfiles)

      ]),
      edus: this.formBuilder.array([
      ]),


    });
  }
  months(months: any) {
    throw new Error("Method not implemented.");
  }

  get f() { return this.EditForm.controls; }

  /* Education */

  
  addExp(index): void {
        
    if(index == 0)
    {
      this.countExp= 1; 
    }

      let isValid = true;
      $("#errorMsg"+index).html('');
      $("#errorMsg"+index).hide();

      $("#fromDateErrorMsg"+index).html('');
      $("#fromDateErrorMsg"+index).hide();
      $("#toDateErrorMsg"+index).html('');
      $("#toDateErrorMsg"+index).hide();
      $("#companyErrorMsg"+index).html('');
      $("#companyErrorMsg"+index).hide();
      $("#poitionErrorMsg"+index).html('');
      $("#poitionErrorMsg"+index).hide();

      if($("#fromDate"+index).val() == '')
      {
          isValid = false;
          $("#errorMsg"+index).html('From date is required');
          $("#errorMsg"+index).show();
          return;
      }

      /*
      if($("#toDate"+index).val() == '')
      {
          isValid = false;
          $("#errorMsg"+index).html('To date is required');
          $("#errorMsg"+index).show();
          return;
      }
      */


      if($("#fromDate"+index).val()!='' && $("#toDate"+index).val()!='')
      {
          let fromDateStamp = new Date($("#fromDate"+index).val());
          let toDateStamp = new Date($("#toDate"+index).val());

          if(fromDateStamp > toDateStamp)
          {
              isValid = false;
              $("#errorMsg"+index).html('From date should be greater than the to date');
              $("#errorMsg"+index).show();
              return;
          }
      }
      
      if(index > 0)
      {
          if($("#fromDate"+index).val()!='')
          {   

              let fromDateStamp = new Date($("#fromDate"+index).val());

              if($("#toDate"+(index-1)).val()!='')
              {
                  let toDateStamp = new Date($("#toDate"+(index-1)).val());
                  if(fromDateStamp < toDateStamp)
                  {
                      isValid = false;
                      $("#errorMsg"+index).html('From date should be greater than the previous to date');
                      $("#errorMsg"+index).show();
                      return;
                  }
              }
              else{

                  isValid = false;
                  $("#errorMsg"+index).html('From date should be greater than the previous to date');
                  $("#errorMsg"+index).show();
                  return;
              }
          }
      }
      if($("#ddlCompany"+index).val() == '')
      {
          isValid = false;
          $("#errorMsg"+index).html('Company name is required');
          $("#errorMsg"+index).show();
          return;
      }

      if($("#ddlPosition"+index).val() == '')
      {
          isValid = false;
          $("#errorMsg"+index).html('Position name is required');
          $("#errorMsg"+index).show();
          return;
      }
  if(isValid)
  {
      (this.EditForm.get('exps') as FormArray).push(
          this.formBuilder.control(null)
      );
  }

}

removeExp(index) {
    if(index == 0)
    {
      this.countExp= 0; 
    }
 (this.EditForm.get('exps') as FormArray).removeAt(index);
}

expFormControls(): AbstractControl[] {
  return (<FormArray> this.EditForm.get('exps')).controls
}

/* Education */
addEdu(index): void {
  
    if(index == 0)
    {
      this.countEdu= 1; 
    }

  let isValid = true;
  
  $("#errorMsg_edu"+index).html('');
  $("#errorMsg_edu"+index).hide();
  

  $("#fromDateErrorMsg_edu"+index).html('');
  $("#fromDateErrorMsg_edu"+index).hide();
  $("#toDateErrorMsg_edu"+index).html('');
  $("#toDateErrorMsg_edu"+index).hide();
  $("#classErrorMsg_edu"+index).html('');
  $("#classErrorMsg_edu"+index).hide();
  $("#collegeErrorMsg_edu"+index).html('');
  $("#collegeErrorMsg_edu"+index).hide();

  if($("#fromDate_edu"+index).val() == '')
  {
      isValid = false;
      $("#errorMsg_edu"+index).html('From date is required');
      $("#errorMsg_edu"+index).show();
      return;
  }

  /*
  if($("#toDate_edu"+index).val() == '')
  {
      isValid = false;
      $("#errorMsg_edu"+index).html('To date is required');
      $("#errorMsg_edu"+index).show();
      return;
  }
  */

  if($("#fromDate_edu"+index).val()!='' && $("#toDate_edu"+index).val()!='')
  {
      let fromDateStamp = new Date($("#fromDate_edu"+index).val());

      let toDateStamp = new Date($("#toDate_edu"+index).val());
      if(fromDateStamp > toDateStamp)
      {
          isValid = false;
          $("#errorMsg_edu"+index).html('From date should not be greater than the to date');
          $("#errorMsg_edu"+index).show();
          return;
      }
  }
  
  if(index > 0)
  {
      if($("#fromDate_edu"+index).val()!='')
      {
          let fromDateStamp = new Date($("#fromDate_edu"+index).val());

          if($("#toDate_edu"+(index-1)).val()!='')
          {
              let toDateStamp = new Date($("#toDate_edu"+(index-1)).val());
              if(fromDateStamp < toDateStamp)
              {
                  isValid = false;
                  $("#errorMsg_edu"+index).html('From date should be greater than the previous to date');
                  $("#errorMsg_edu"+index).show();
                  return;
              }
          }else{
                  isValid = false;
                  $("#errorMsg_edu"+index).html('From date should be greater than the previous to date');
                  $("#errorMsg_edu"+index).show();
                  return;
          }
      }
  }
  if($("#ddlClass_edu"+index).val() == '')
  {
      isValid = false;
      $("#errorMsg_edu"+index).html('Education should not be blank');
      $("#errorMsg_edu"+index).show();
      return;
  }

  if($("#ddlColleges_edu"+index).val() == '')
  {
      isValid = false;
      $("#errorMsg_edu"+index).html('College/University name is required');
      $("#errorMsg_edu"+index).show();
      return;
  }
if(isValid)
{
  (this.EditForm.get('edus') as FormArray).push(
      this.formBuilder.control(null)
  );
}

}

removeEdu(index) {
  if(index == 0)
    {
      this.countEdu= 0; 
    }
(this.EditForm.get('edus') as FormArray).removeAt(index);
}

eduFormControls(): AbstractControl[] {
return (<FormArray> this.EditForm.get('edus')).controls
}



  patch() {
    const control = <FormArray>this.EditForm.get('exps');
    const controlEdu = <FormArray>this.EditForm.get('edus');

    this.employeeProfiles['professionalExp'].forEach((x, index) => {
      control.push(this.patchValues(x.fromDate))
    });

    this.employeeProfiles['educationDetails'].forEach((x, index) => {
      controlEdu.push(this.patchValues(x.fromDate))
    });

  }

  
  // assign the values
  patchValues(value) {
    return this.formBuilder.group({
      fromDate: [value]
    })
  }

  /* Education */
 
 

onFileChange(event) {
  let reader = new FileReader();
  if (event.target.files && event.target.files.length > 0) {
  let file = event.target.files[0];
  // console.log(file.size);
  // console.log(file);
  this.ImageRequired = false;
  this.ImageTypeeerror = false;
  this.ImageSizeerror = false;

  var pattern = /image-*/;
  if (!file.type.match(pattern)) {
      this.ImageTypeeerror = true;
      return;
   }
  else if(parseInt(file.size) > 2000000)
   {
    this.ImageSizeerror = true;
    return;
   }
  else {
  let img = new Image();
  img.src = window.URL.createObjectURL( file );
  reader.readAsDataURL(file);
  reader.onload = (event:any) => {
      setTimeout(() => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      window.URL.revokeObjectURL( img.src );

      // console.log(width + '*' + height);
      if(width <200)
      {
        this.resetImage();
        this.ImageWidth = true;
        return;
      }


          // console.log(event.target);
          this.ImageSizeerror = false;
          this.ImageTypeeerror = false;
          
          var canvas=document.createElement("canvas");
          var context=canvas.getContext("2d");
          // defining cause it wasnt
            var maxWidth = 130,
                  maxHeight = 130;

              if(img.width > maxWidth)
              {
                      var ratio = maxWidth / img.width;
              }
              else if(img.height > maxHeight)
              {
                      ratio = maxHeight / img.height;
              }
              else {
                      ratio = 1;
              }

              canvas.width = img.width;
              canvas.height = img.height;
              context.drawImage(img, 0, 0);

              canvas.width = img.width * ratio;
              canvas.height = img.width * ratio;
              //context.drawImage(canvas, 0, 0, canvas.width, canvas.height);

        
          context.drawImage(img,
              0,
              0,
              img.width,
              img.height,
              0,
              0,
              canvas.width,
              canvas.height
          );
        
          this.imageSrc = canvas.toDataURL();
          this.EditForm.patchValue({
              fileSource: file
          });

          
      
      }, 100);
      };
    } // else 
}  

}

  fileEvent(event) {
    let files = event.target.files[0].name;
    this.newResumeName = files;
    document.getElementById('fileList').innerHTML = files;
    // this.EditForm.controls['fileInput'].setValue(files ? files.name : '');
    const fileInput = event.target.files[0];
    this.EditForm.patchValue({
      fileInputSource: fileInput
    });

  }
  removeFileLink() {
    document.getElementById('fileList').innerHTML = '';
  }


  resetImage() {
    this.ImageRequired = true;
    this.imageSrc = 'assets/img/p13.png';
  }

  onSubmit() {
    this.submitted = true;
    this.showSkillErrorMessage = true;
    let expEduValidate = true;
    
    /*
    if (this.selectedSkillItems.length == 0) {
      this.showSkillErrorMessage = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    } else {
      this.showSkillErrorMessage = false;
    }
    */
   this.showSkillErrorMessage = false;

   if (this.selectedSkillItems.length == 0) {
    this.isSkillsChecked = 'No';
  } else {
    this.isSkillsChecked = 'Yes';
  }

    
            /** Exp validation */
            $("input[name='fromDate[]']").each(function(index, value) {
                
              // console.log('first name required');

              $("#fromDateErrorMsg"+index).hide();
              $("#fromDateErrorMsg"+index).html('');
              $("#errorMsg"+index).html('');
              $("#errorMsg"+index).hide();
              
              if ($(this).val() == "") {
                  $("#fromDateErrorMsg"+index).show();
                  $("#fromDateErrorMsg"+index).html('From date should not be blank');
                  expEduValidate = false;
              }

              if(index > 0)
              {
                  if($("#fromDate"+index).val()!='')
                  {
                      let fromDateStamp = new Date($("#fromDate"+index).val());

                      if($("#toDate"+(index-1)).val()!='')
                      {
                          let toDateStamp = new Date($("#toDate"+(index-1)).val());
                          if(fromDateStamp < toDateStamp)
                          {
                              $("#fromDateErrorMsg"+index).html('From date should be greater than the previous to date');
                              $("#fromDateErrorMsg"+index).show();
                              expEduValidate = false;;
                          }
                      }
                      else{
                               $("#fromDateErrorMsg"+index).html('From date should be greater than the previous to date');
                              $("#fromDateErrorMsg"+index).show();
                              expEduValidate = false;;
                      }
                  }
              }

            });
          
            $("input[name='toDate[]']").each(function(index, value) {
              $("#toDateErrorMsg"+index).hide();
              $("#toDateErrorMsg"+index).html('');

              /*
              if ($(this).val() == "") {
                  $("#toDateErrorMsg"+index).show();
                  $("#toDateErrorMsg"+index).html('To date should not be blank');
                  return;
              }
              */

              if($("#fromDate"+index).val()!='' && $("#toDate"+index).val()!='')
              {
                  let fromDateStamp = new Date($("#fromDate"+index).val());
                  let toDateStamp = new Date($("#toDate"+index).val());

                  if(fromDateStamp > toDateStamp)
                  {
                      $("#toDateErrorMsg"+index).html('From date should not be greater than the to date');
                      $("#toDateErrorMsg"+index).show();
                      expEduValidate = false;;
                  }
              }
            });
          
           
          $("input[name='ddlCompany[]']").each(function(index, value) {
              
              // console.log('index'+index);

              $("#companyErrorMsg"+index).hide();
              $("#companyErrorMsg"+index).html('');

              if ($(this).val() == "") {
                  
                  // console.log('error');

                  $("#companyErrorMsg"+index).show();
                  $("#companyErrorMsg"+index).html('Company name should not be blank');
                  expEduValidate = false;;
              }
              else{
                  var re = /^[ A-Za-z0-9_@.,-/+-]*$/
                  if (!re.test($(this).val())) {
                      $("#companyErrorMsg"+index).show();
                      $("#companyErrorMsg"+index).html('Company name should not allow special characters');
                      expEduValidate = false;;
                  }
              }
            });

          $("input[name='ddlPositions[]']").each(function(index, value) {
              
              // console.log('index12'+index);

              $("#poitionErrorMsg"+index).hide();
              $("#poitionErrorMsg"+index).html('');

              if ($(this).val() == "") {

                  // console.log('error1');


                  $("#poitionErrorMsg"+index).show();
                  $("#poitionErrorMsg"+index).html('Position name should not be blank');
                  expEduValidate = false;;
              }
              else{
                  var re = /^[ A-Za-z0-9_@.,-/+-]*$/
                  if (!re.test($(this).val())) {
                      $("#poitionErrorMsg"+index).show();
                      $("#poitionErrorMsg"+index).html('Position name should not allow special characters');
                      expEduValidate = false;;
                  }
              }
            });


          /** End exp validation */
          
          /** Edu validation */
        
          $("input[name='fromDate_edu[]']").each(function(index, value) {
              $("#fromDateErrorMsg_edu"+index).hide();
              $("#fromDateErrorMsg_edu"+index).html('');
              $("#errorMsg_edu"+index).html('');
              $("#errorMsg_edu"+index).hide();
  

              if ($(this).val() == "") {
                  $("#fromDateErrorMsg_edu"+index).show();
                  $("#fromDateErrorMsg_edu"+index).html('From date should not be blank');
                  expEduValidate = false;;
              }

              if(index > 0)
              {
                  if($("#fromDate_edu"+index).val()!='')
                  {
                      let fromDateStamp = new Date($("#fromDate_edu"+index).val());
                      if($("#toDate_edu"+(index-1)).val()!='')
                      {
                          let toDateStamp = new Date($("#toDate_edu"+(index-1)).val());
                          if(fromDateStamp < toDateStamp)
                          {
                              $("#fromDateErrorMsg_edu"+index).html('From date should be greater than the previous to date');
                              $("#fromDateErrorMsg_edu"+index).show();
                              expEduValidate = false;;
                          }
                      }else{
                              $("#fromDateErrorMsg_edu"+index).html('From date should be greater than the previous to date');
                              $("#fromDateErrorMsg_edu"+index).show();
                              expEduValidate = false;;
                      }
                  }
              }

            });
          
            $("input[name='toDate_edu[]']").each(function(index, value) {
              $("#toDateErrorMsg_edu"+index).hide();
              $("#toDateErrorMsg_edu"+index).html('');

              /*
              if ($(this).val() == "") {
                  $("#toDateErrorMsg_edu"+index).show();
                  $("#toDateErrorMsg_edu"+index).html('To date should not be blank');
                  return;
              }
              */

              if($("#fromDate_edu"+index).val()!='' && $("#toDate_edu"+index).val()!='')
              {
                  let fromDateStamp = new Date($("#fromDate_edu"+index).val());
                  let toDateStamp = new Date($("#toDate_edu"+index).val());

                  if(fromDateStamp > toDateStamp)
                  {
                      $("#toDateErrorMsg_edu"+index).html('From date should not be greater than the to date');
                      $("#toDateErrorMsg_edu"+index).show();
                      expEduValidate = false;;
                  }
              }
            });
          
           
          $("input[name='ddlClass_edu[]']").each(function(index, value) {
              
              // console.log('index'+index);

              $("#classErrorMsg_edu"+index).hide();
              $("#classErrorMsg_edu"+index).html('');

              if($(this).val() == "") {
                  
                  // console.log('error');

                  $("#classErrorMsg_edu"+index).show();
                  $("#classErrorMsg_edu"+index).html('Education should not be blank');
                  expEduValidate = false;;
              }
              else{
                  var re = /^[ A-Za-z0-9_@.,-/+-]*$/
                  if (!re.test($(this).val())) {
                      $("#classErrorMsg_edu"+index).show();
                      $("#classErrorMsg_edu"+index).html('Education should not allow special characters');
                      expEduValidate = false;;
                  }
              }
            });

          $("input[name='ddlColleges_edu[]']").each(function(index, value) {
              

              $("#collegeErrorMsg_edu"+index).hide();
              $("#collegeErrorMsg_edu"+index).html('');

              if($(this).val() == "") {

                  // console.log('error1');


                  $("#collegeErrorMsg_edu"+index).show();
                  $("#collegeErrorMsg_edu"+index).html('College/University name should not be blank');
                  expEduValidate = false;;
              }
              else{
                  var re = /^[ A-Za-z0-9_@.,-/+-]*$/
                  if (!re.test($(this).val())) {
                      $("#collegeErrorMsg_edu"+index).show();
                      $("#collegeErrorMsg_edu"+index).html('College/University name should not allow special characters');
                      expEduValidate = false;;
                  }
              }
            });



    // console.log(this.slectedSkillItemString);


    if(!this.EditForm.value.fileSource)
    {
        this.ImageRequired = true;
    }

    if(this.imageSrc != 'assets/img/p13.png')
    {
      this.ImageRequired = false;
    }

    if(this.ImageRequired)
    {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    if (this.EditForm.invalid) {
      //  console.log('here');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      //this.findInvalidControls();
      return;
    }

    if(!expEduValidate)
    {
                // console.log('here');
      window.scrollTo({ top: 0, behavior: 'smooth' });
       return;
    }

    this.spinner.show();

    //            console.log(this.EditForm.value);
    const formData = new FormData();

    formData.append('firstName', this.EditForm.value.firstName);
    formData.append('lastName', this.EditForm.value.lastName);
    formData.append('birthDateMonth', this.EditForm.value.birthDateMonth);
    formData.append('birthDateDate', this.EditForm.value.birthDateDate);
    formData.append('birthDateYear', this.EditForm.value.birthDateYear);
    formData.append('birthDateGender', this.EditForm.value.birthDateGender);
    formData.append('organization', this.EditForm.value.organization);
    formData.append('website', this.EditForm.value.website);
    formData.append('phoneNumber', this.EditForm.value.phoneNumber.internationalNumber);
    if (this.EditForm.value.altphoneNumber) {
      formData.append('altphoneNumber', this.EditForm.value.altphoneNumber.internationalNumber);
    }
    formData.append('language', this.EditForm.value.language);
    formData.append('bio', this.EditForm.value.bio);
    formData.append('ddlLocation', this.selectedLocation['id']);
    formData.append('file', this.EditForm.value.file);
    formData.append('imageProfile', this.EditForm.value.imageProfile);
    formData.append('InstagramLink', this.EditForm.value.InstagramLink);
    formData.append('FacebookLink', this.EditForm.value.FacebookLink);
    formData.append('TwitterLink', this.EditForm.value.TwitterLink);
    formData.append('YoutubeLink', this.EditForm.value.YoutubeLink);
    formData.append('GithubLink', this.EditForm.value.GithubLink);
    formData.append('fromDate1', this.EditForm.value.fromDate1);
    formData.append('toDate1', this.EditForm.value.toDate1);
    formData.append('fileSource', this.EditForm.value.fileSource);
    // formData.append('file', this.EditForm.get('fileSource').value);
    // formData.append('ddlCompany1', this.selectedCompany['id']);     
    // formData.append('ddlPosition1', this.selectedPosition['id']);     
    formData.append('ddlCompany1', this.EditForm.value.ddlCompany1);
    formData.append('ddlPosition1', this.EditForm.value.ddlPosition1);

    formData.append('fileInput', this.EditForm.value.fileInputSource);
    //  formData.append('resume', this.EditForm.get('fileInput').value);

    formData.append('skills', this.slectedSkillItemString);
    formData.append('isSkillsChecked', this.isSkillsChecked);

    formData.append('loggedInUser', this.loggedInEmployeeID);

    $("input[name='fromDate[]']").each(function(index, value) {
      formData.append('fromDate[]', $(this).val());
    });
    $("input[name='toDate[]']").each(function(index, value) {
      formData.append('toDate[]', $(this).val());
    });
    $("input[name='ddlCompany[]']").each(function(index, value) {
      formData.append('ddlCompany[]', $(this).val());
    });

    $("input[name='ddlPositions[]']").each(function(index, value) {
      formData.append('ddlPosition[]', $(this).val());
    });

    $("input[name='description[]']").each(function(index, value) {
      formData.append('description[]', $(this).val());
    });


    $("input[name='fromDate_edu[]']").each(function(index, value) {
      formData.append('fromDate_edu[]', $(this).val());
    });
    $("input[name='toDate_edu[]']").each(function(index, value) {
      formData.append('toDate_edu[]', $(this).val());
    });
    $("input[name='ddlClass_edu[]']").each(function(index, value) {
      formData.append('ddlClass_edu[]', $(this).val());
    });

    $("input[name='ddlColleges_edu[]']").each(function(index, value) {
      formData.append('ddlColleges_edu[]', $(this).val());
    });

    $("input[name='description_edu[]']").each(function(index, value) {
      formData.append('description_edu[]', $(this).val());
    });

   

    const _that = this;
    this.RegisterService_
      .editProfile(formData)
      .subscribe((resp) => {

        if (resp.status_code == '201') {
          this.spinner.hide();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.alerts.setDefaults('timeout', 500);
          this.alerts.setMessage(resp.message, 'error');

          $("#primaryPhoneNumber").val('');
          $("#phoneAvailability").html(resp.message);
          $("#phoneAvailability").show();
          return;


        }
        else {
          this.spinner.hide();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          $('.alertsContainer .alertsRow.error').attr("style", "display: none !important");
          
          this.alerts.setMessage('You profile details has been updated! Please wait ..', 'success');

          setTimeout(function () {
            $('.alertsContainer .alertsRow.success').attr("style", "display: none !important");
            _that.router.navigate(['/jsregister/profile']);
          }, 2000);
        }




      });

    //   }

    // this.loading = true;

  }
  showFlashMsg(respMsg, type) {
    // console.log(respMsg);
  }

  redictedtoHomePage() {
    const _that = this;
    setTimeout(function () {
      $('#waitDialog').dialog('close');
    }, 5000);

    setTimeout(function () {
      _that.router.navigate(['/']);
    }, 10000);

  }

  /* Auto completes */
  location_keyword = 'locationName';
  selectLocationEvent(item) {
    // do something with selected item
    this.selectedLocation = item;
    this.showLocationErrorMessage = false;
  }

  onChangeLocationSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    this.showLocationErrorMessage = false;
  }

  onLocationFocused(e) {
    // do something when input is focused

  }
  onLocationClosed(e) {
    // this.showLocationErrorMessage = true;
  }

  company_keyword = 'companyName';
  selectCompaniesEvent(item) {
    // do something with selected item
    this.showCompanyErrorMessage = false;
    this.selectedCompany = item;
  }

  onChangeCompaniesSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onCompaniesFocused(e) {
    // do something when input is focused
  }
  onCompaniesClosed(e) {
    this.showCompanyErrorMessage = true;
  }


  position_keyword = 'positionName';
  selectPositionEvent(item) {
    // do something with selected item
    this.showPositionErrorMessage = false;
    this.selectedPosition = item;
  }

  onChangePositionSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onPositionFocused(e) {
    // do something when input is focused
  }
  onPositionClosed(e) {
    this.showPositionErrorMessage = true;
  }

  onItemSelect(item: any) {
    this.slectedSkillItemString = '';
    for (let i = 0; i < this.selectedSkillItems.length; i++) {
      this.slectedSkillItemString += this.selectedSkillItems[i].id + ',';
    }

  }
  OnItemDeSelect(item: any) {
    this.slectedSkillItemString = '';
    for (let i = 0; i < this.selectedSkillItems.length; i++) {
      this.slectedSkillItemString += this.selectedSkillItems[i].id + ',';
    }
  }
  onSelectAll(items: any) {
    this.slectedSkillItemString = '';
    for (let i = 0; i < this.selectedSkillItems.length; i++) {
      this.slectedSkillItemString += this.selectedSkillItems[i].id + ',';
    }
  }
  onDeSelectAll(items: any) {
    this.slectedSkillItemString = '';
    for (let i = 0; i < this.selectedSkillItems.length; i++) {
      this.slectedSkillItemString += this.selectedSkillItems[i].id + ',';
    }

  }

  /* End of auto completes. */

  async myFunction() {

    // console.log('ddd');

    const locations = this.CommonService_.getLocations().toPromise();
    // const positions = this.CommonService_.getPositions().toPromise();
    // const companies = this.CommonService_.getCompanies().toPromise();
    const skills = this.CommonService_.getSkills().toPromise();
    const genders = this.CommonService_.getGenders().toPromise();
    const languages = this.CommonService_.getLanguages().toPromise();

    let res = await Promise.all([locations, skills, genders, languages]);

    this.locations = res[0];
    // this.positions = res[1];
    // this.companies = res[2];
    this.skills = res[1];
    this.genders = res[2];
    this.languages = res[3];

    this.dropdownList = this.skills;
    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Skills",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };

    // here you can retrieve promises results,
    // in res[0], res[1], res[2] respectively.
  }

  async getEmployeeProfile(employeeID) {
    const _that = this;
    this.RegisterService_
      .getEmployeeProfile(employeeID)
      .subscribe(employeeProfiles => (_that.employeeProfiles = employeeProfiles))
      .add(() => {
        /*console.log(_that.employeeProfiles['profileData'][0].firstName);*/
       //  console.log(_that.employeeProfiles);
        this.assignEmployeeDetails();
        _that.edus = _that.employeeProfiles['educationDetails'];
        _that.exps = _that.employeeProfiles['professionalExp'];
        _that.countExp = _that.exps.length;
        _that.countEdu = _that.edus.length;

        // console.log(_that.exps);

        // this.initDetails(_that.employeeProfiles['professionalExp']);
        this.patch();
        this.isContentLoaded = true;
        this.spinner.hide();
      });

  }

  assignEmployeeDetails() {
    const _that = this;


    let dobArray = _that.employeeProfiles['profileData'][0].dob.split('-');
    this.EditForm.controls["firstName"].setValue(_that.employeeProfiles['profileData'][0].firstName);
    this.EditForm.controls["lastName"].setValue(_that.employeeProfiles['profileData'][0].lastName);
    this.EditForm.controls["birthDateYear"].setValue(dobArray[0]);
    this.EditForm.controls["birthDateMonth"].setValue(dobArray[1]);
    this.EditForm.controls["birthDateDate"].setValue(dobArray[2]);
    this.EditForm.controls["birthDateGender"].setValue(_that.employeeProfiles['profileData'][0].gender);
    this.EditForm.controls["ddlLocation"].setValue(_that.employeeProfiles['profileData'][0].locationName);
    this.selectedLocation = _that.employeeProfiles['profileData'][0].locationID;
    this.EditForm.controls["organization"].setValue(_that.employeeProfiles['profileData'][0].organization);
    this.EditForm.controls["website"].setValue(_that.employeeProfiles['profileData'][0].website);
    this.EditForm.controls["language"].setValue(_that.employeeProfiles['profileData'][0].languageID);
    this.imageSrc = _that.employeeProfiles['profileData'][0].imageProfile;
    this.EditForm.controls["bio"].setValue(_that.employeeProfiles['profileData'][0].about);
    this.EditForm.controls["phoneNumber"].setValue(_that.employeeProfiles['profileData'][0].primaryPhone);
    this.EditForm.controls["altphoneNumber"].setValue(_that.employeeProfiles['profileData'][0].alternatePhone);

    // document.getElementById('fileList').innerHTML = _that.employeeProfiles['userResumes'][0].resumeName;

    this.EditForm.controls["fileInputSource"].setValue(_that.employeeProfiles['userResumes'][0].resumePath);
    this.EditForm.controls["InstagramLink"].setValue(_that.employeeProfiles['userSocialLinks'][0].socialProfile);
    this.EditForm.controls["FacebookLink"].setValue(_that.employeeProfiles['userSocialLinks'][1].socialProfile);
    this.EditForm.controls["TwitterLink"].setValue(_that.employeeProfiles['userSocialLinks'][2].socialProfile);
    this.EditForm.controls["YoutubeLink"].setValue(_that.employeeProfiles['userSocialLinks'][3].socialProfile);
    this.EditForm.controls["GithubLink"].setValue(_that.employeeProfiles['userSocialLinks'][4].socialProfile);

    // this.selectedPosition = _that.employeeProfiles['professionalExp'][0].positionName;
    // this.selectedCompany = _that.employeeProfiles['professionalExp'][0].companyName;
    this.selectedSkillItems = _that.employeeProfiles['skills'];
    


  }


  public findInvalidControls() {
    const invalid = [];
    const controls = this.EditForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    // console.log(invalid);
  }

  verifyEmailAvailability(emailAddress) {

    this.isEmailAvailable = true;
    this.RegisterService_
      .verifyEmailAvailabilityForEdit(emailAddress, this.loggedInEmployeeID)
      .subscribe((resp) => {
        //  console.log(resp.length);
        if (resp.length > 0) {
          $("#emailAddress").val('');
          $("#emailAddress").focus();
          this.isEmailAvailable = false;
        }

      });
  }
  resetEmailValidation() {
    this.isEmailAvailable = true;
  }

  hidePhoneAvailability() {
    $("#phoneAvailability").hide();
  }

  cancelRegForm() {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you want to cancel')
      .then((confirmed) => { if (confirmed) { this.router.navigate(['/jsregister/profile']); } })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

  }

  ngAfterViewChecked() {
  //  console.log("after content init");
    if (this.isContentLoaded) {

      if(!this.isExpEdutDetailsAsigned)
      {
        this.employeeProfiles['professionalExp'].forEach((x, index) => {
          $("#fromDate" + index).val(x.fromDate);
          $("#toDate" + index).val(x.toDate);
          $("#ddlCompany" + index).val(x.companyName);
          $("#ddlPosition" + index).val(x.positionName);
          $("#description"+index).val(x.description);
        });

        this.employeeProfiles['educationDetails'].forEach((x, index) => {
          $("#fromDate_edu" + index).val(x.fromDate);
          $("#toDate_edu" + index).val(x.toDate);
          $("#ddlClass_edu" + index).val(x.className);
          $("#ddlColleges_edu" + index).val(x.collageName);
          $("#description_edu"+index).val(x.description);
        });
        this.isExpEdutDetailsAsigned = true;
      }

      $("#fileList").html(this.employeeProfiles['userResumes'][0].resumeName);
      if(this.newResumeName!='')
      {
        $("#fileList").html(this.newResumeName);  
      }

    }

  }



}
