import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray , AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ConfirmPasswordValidator } from './../../../../_validators/confirm-password.validator';
import { CommonService } from './../../../../_services/common.service';
import { RegisterService } from './../../../../_services/register.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import months from './../../../../_helpers/months.json';
import dates from './../../../../_helpers/dates.json';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { NgxSpinnerService } from "ngx-spinner";
import { AlertsService } from 'angular-alert-module';
import { ConfirmationDialogService } from './../../confirmation-dialog-component/confirmation-dialog-service';

declare var jQuery: any;
declare var $: any;

@Component({
    selector: 'facehiring-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css'],
    providers: [CommonService , ConfirmationDialogService]
})
export class RegistrationComponent implements OnInit {

    registerForm: FormGroup;
    loading = false;
    submitted = false;
    locations: Array<any>;
    positions: Array<any>;
    companies: Array<any>;
    skills:Array<any>;
    genders:Array<any>;
    languages:Array<any>;

    imageSrc: string;
    url:string;
    isLocationsLoaded = false;
    
    showLocationErrorMessage = false;
    showCompanyErrorMessage = false;
    showSkillErrorMessage = false;
    showPositionErrorMessage = false;

    selectedLocation:any;
    selectedCompany:any;
    selectedPosition:any;
    
    /* Skills */
    dropdownList = [];
    selectedSkillItems = [];
    dropdownSettings = {};
    slectedSkillItemString = '';

    separateDialCode = true;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

    ImageSizeerror:boolean = false;
    ImageTypeeerror:boolean = false;
    ImageRequired:boolean = false;
    ImageWidth:boolean=false;

    ResumeTypeError:boolean = false;

    public monthLists:{id:string, name:string}[] = months;
    public dateLists:{id:string, data:any}[] = dates;

    public isEmailAvailable = true;
    public isPhoneAvailable = true;
    public isReferenceCodeAvailable = true;

    public countExp = 1;
    public countEdu = 1;
    
    public loggedInEmployeeID:any;
    public currentUser:any;

    public maxDate: Date = new Date(); 
    public minDate: Date = new Date(1900, 0, 1);
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        //  private authenticationService: AuthenticationService,
        // private userService: UserService,
        private CommonService_: CommonService,
        private RegisterService_:RegisterService,
        private spinner: NgxSpinnerService,
        private alerts: AlertsService,
        private confirmationDialogService: ConfirmationDialogService
    ) {
        // redirect to home if already logged in
    }

    changePreferredCountries() {
		this.preferredCountries = [CountryISO.India, CountryISO.Canada];
	}

    ngOnInit() {
        
        // this.getLoations();
        // this.getPositions();
        // this.getCompanies();
        // this.getskills();
        this.spinner.show();

        this.myFunction();
        this.selectedSkillItems = [];

        this.registerForm = this.formBuilder.group({
            
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
            password: ['',
                [
                    Validators.required,
                    Validators.minLength(6)

                ]
            ],
            confirmPassword:
                ['',
                    [
                        Validators.required,
                        Validators.minLength(6)

                    ]
                ],
                birthDateMonth : 
                [
                    '',[Validators.required]
                ],
                birthDateDate : 
                [
                    '',[Validators.required]
                ],
                birthDateYear : 
                [
                    '',[Validators.required]
                ],
                birthDateGender : 
                [
                    '',[Validators.required]
                ],
                emailAddress: ['', 
                        [
                            Validators.required, 
                            Validators.email,
                            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
                        ]
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
               phoneNumber: ['', 
                        [
                            Validators.required
                        ]
                ],
                /*altphoneNumber: ['', 
                        [
                            Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')
                        ]
                ],*/
                // phoneNumber:[],
                altphoneNumber:[],
                language: 
                [
                    '',[Validators.required]
                ],
                bio: 
                [],
                ddlLocation:
                [
                    '',[Validators.required]
                ],
                skills:[],
                file:[],
                imageProfile:[],
                InstagramLink:[],
                FacebookLink:[],
                TwitterLink:[],
                YoutubeLink:[],
                GithubLink:[],
                fromDate1:[],
                toDate1:[],
                fileSource:[],
                resumeFileSource:[],
                ddlCompany1:['', 
                    [
                        Validators.pattern(/^[a-z\d\-_\s]+$/i)
                    ]
                ],
                ddlPosition1:['',
                    [
                        Validators.pattern(/^[a-z\d\-_\s]+$/i)
                    ] 
                ],
                fileInput: [],
                fileInputSource:[],
                referenceCode:['',[Validators.pattern(/^[0-9]\d*$/)]],
                exps: this.formBuilder.array([
                    this.formBuilder.control(null)
                  ]),
                edus:this.formBuilder.array([
                    this.formBuilder.control(null)
                  ])


        },
            { validator: ConfirmPasswordValidator.MatchPassword }
        );
    }
    months(months: any) {
        throw new Error("Method not implemented.");
    }
    

    get f() { return this.registerForm.controls; }

    /*
    onFileChange(event) {
  
        if (event.target.files.length > 0) {
            var reader = new FileReader();
                reader.onload = (event:any) => {

                this.imageSrc = event.target.result;
            }
            reader.readAsDataURL(event.target.files[0]);
            const file = event.target.files[0];
            this.registerForm.patchValue({
                fileSource: file
            });
        }
      }
     */

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
        (this.registerForm.get('exps') as FormArray).push(
            this.formBuilder.control(null)
        );
    }

  }

  removeExp(index) {
      if(index == 0)
      {
        this.countExp= 0; 
      }
   (this.registerForm.get('exps') as FormArray).removeAt(index);
  }

  expFormControls(): AbstractControl[] {
    return (<FormArray> this.registerForm.get('exps')).controls
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
    (this.registerForm.get('edus') as FormArray).push(
        this.formBuilder.control(null)
    );
}

}

removeEdu(index) {
    if(index == 0)
      {
        this.countEdu= 0; 
      }
(this.registerForm.get('edus') as FormArray).removeAt(index);
}

eduFormControls(): AbstractControl[] {
return (<FormArray> this.registerForm.get('edus')).controls
}

/* education */


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
            this.ImageWidth = false;
            
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
            this.registerForm.patchValue({
                fileSource: file
            });
  
            
        
        }, 100);
        };
      } // else 
  }  
  
  }
  
      fileEvent(event){
        this.ResumeTypeError = false;  

        var iSize = event.target.files[0].size / 1024; 
        iSize = (Math.round(iSize * 100) / 100)
        // $("#size").html( iSize  + "kb"); 
        if(iSize<=1024)
        {
            let resumeValue = $("#file-upload").val();
                var ext = resumeValue.split('.').pop();
                if(ext=="pdf" || ext=="docx" || ext=="doc"){
                    let files = event.target.files[0].name;
                    document.getElementById('fileList').innerHTML = files;
                    // this.registerForm.controls['fileInput'].setValue(files ? files.name : '');
                    const fileInput = event.target.files[0];
                        this.registerForm.patchValue({
                            fileInputSource: fileInput
                        });
                } else{
                        // console.log('error');
                        this.ResumeTypeError = true;
                        document.getElementById('fileList').innerHTML = '';
                }
            } // size less than 1024
            else{
                this.ResumeTypeError = true;
                document.getElementById('fileList').innerHTML = '';
            }
    }
    removeFileLink()
    {
        document.getElementById('fileList').innerHTML = '';
    }


  resetImage()
    {
        this.ImageRequired = true;
        this.imageSrc = 'assets/img/p13.png';
        
    }

    onSubmit() {
        this.submitted = true;
        let expEduValidate = true;
        $("#phoneAvailability").hide();

        // reset alerts on submit
        // this.alertService.clear();
        // this.showLocationErrorMessage = true;
        this.showSkillErrorMessage = true;
        // stop here if form is invalid
        // console.log(this.selectedSkillItems);
        
        /*
         if(this.selectedSkillItems.length == 0)
          {
              this.showSkillErrorMessage = true;
              window.scrollTo({ top: 0, behavior: 'smooth' });
              return;
           } else {
                this.showSkillErrorMessage = false;
           }
        */
        this.showSkillErrorMessage = false;

            //else{
            //    this.showSkillErrorMessage = false;
           // }
            
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


            /** End Edu validation */

            if(!this.registerForm.value.file)
            {
                this.ImageRequired = true;
            }
            
            if(this.ImageRequired)
            {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            if (this.registerForm.invalid) {
                // console.log('invalid');
                window.scrollTo({ top: 0, behavior: 'smooth' });
               //  this.findInvalidControls();
                return;
            }
            if(!expEduValidate)
            {
                // console.log('here');
                window.scrollTo({ top: 0, behavior: 'smooth' });
               return;
            }
              this.spinner.show();
             


            /** End Edu validation */


             // return;


            this.spinner.show();

           // console.log(this.registerForm.value);
           const formData = new FormData();
          
           formData.append('firstName', this.registerForm.value.firstName);
           formData.append('lastName', this.registerForm.value.lastName);
           formData.append('password', this.registerForm.value.password);
           formData.append('birthDateMonth', this.registerForm.value.birthDateMonth);
           formData.append('birthDateDate', this.registerForm.value.birthDateDate);
           formData.append('birthDateYear', this.registerForm.value.birthDateYear);
           formData.append('birthDateGender', this.registerForm.value.birthDateGender);
           formData.append('emailAddress', this.registerForm.value.emailAddress);
           formData.append('organization', this.registerForm.value.organization);
           formData.append('website', this.registerForm.value.website);
           formData.append('phoneNumber', this.registerForm.value.phoneNumber.internationalNumber);
           if(this.registerForm.value.altphoneNumber)
           {
            formData.append('altphoneNumber', this.registerForm.value.altphoneNumber.internationalNumber);
           }
           formData.append('language', this.registerForm.value.language);
           formData.append('bio', this.registerForm.value.bio);
           formData.append('ddlLocation', this.selectedLocation['id']);
           formData.append('file', this.registerForm.value.file); 
           formData.append('imageProfile', this.registerForm.value.imageProfile); 
           formData.append('InstagramLink', this.registerForm.value.InstagramLink);   
           formData.append('FacebookLink', this.registerForm.value.FacebookLink);     
           formData.append('TwitterLink', this.registerForm.value.TwitterLink);     
           formData.append('YoutubeLink', this.registerForm.value.YoutubeLink);     
           formData.append('GithubLink', this.registerForm.value.GithubLink);     
           // formData.append('fromDate1', this.registerForm.value.fromDate1);     
           // formData.append('toDate1', this.registerForm.value.toDate1);     
           formData.append('fileSource', this.registerForm.value.fileSource);     
           formData.append('file', this.registerForm.get('fileSource').value);
          //  formData.append('ddlCompany1', this.selectedCompany['id']);     
          //  formData.append('ddlPosition1', this.selectedPosition['id']);     
          formData.append('fileInput', this.registerForm.value.fileInputSource);     
          formData.append('resume', this.registerForm.get('fileInput').value);
         // formData.append('ddlCompany1', this.registerForm.value.ddlCompany1);
         // formData.append('ddlPosition1', this.registerForm.value.ddlPosition1);
           formData.append('skills', this.slectedSkillItemString);
          // formData.append('exps', this.registerForm.value.exps);

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

          formData.append('referenceCode', this.registerForm.value.referenceCode);  
           
            const _that = this;
            this.RegisterService_
            .submitRegister(formData)
            .subscribe((resp) => {
                // const respMsg = "Thank you for that information. We will log this request to be completed within 30 days";
               //  this.showFlashMsg(respMsg,"success");
               //  console.log(resp);
                // console.log(resp.status_code);

              if(resp.status_code == '201')
              {
                this.spinner.hide();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.alerts.setDefaults('timeout',500);
                this.alerts.setMessage(resp.message,'error');
                   $("#primaryPhoneNumber").val('');
                   $("#phoneAvailability").html(resp.message);
                   $("#phoneAvailability").show();
                   return;

              } 
              else {
               
                this.spinner.hide();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                $('.alertsContainer .alertsRow.error').attr("style", "display: none !important");
                this.alerts.setMessage('Thank you. Your registration has been completed! Please check your email to activate the facehiring account! Please wait ..' ,'success');
                setTimeout(function(){
                    _that.router.navigate(['/']);
                   }, 2000);
               
              }
              
              
                
              });

       //   }

        // this.loading = true;

    }
    showFlashMsg(respMsg , type)
    {
        // console.log(respMsg);
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
    }

    onLocationFocused(e){
    // do something when input is focused
    }
    onLocationClosed(e){
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

    onCompaniesFocused(e){
    // do something when input is focused
    }
    onCompaniesClosed(e){
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

    onPositionFocused(e){
    // do something when input is focused
    }
    onPositionClosed(e){
        this.showPositionErrorMessage = true;
    }

    onItemSelect(item:any){
        this.slectedSkillItemString = '';
        for(let i=0; i<this.selectedSkillItems.length; i++){
          this.slectedSkillItemString += this.selectedSkillItems[i].id+',';
        }
        this.showSkillErrorMessage = false;
    }
    OnItemDeSelect(item:any){
        this.slectedSkillItemString = '';
        for(let i=0; i<this.selectedSkillItems.length; i++){
          this.slectedSkillItemString += this.selectedSkillItems[i].id+',';
        }
    }
    onSelectAll(items: any){
        this.slectedSkillItemString = '';
        for(let i=0; i<this.selectedSkillItems.length; i++){
          this.slectedSkillItemString += this.selectedSkillItems[i].id+',';
        }
    }
    onDeSelectAll(items: any){
        this.slectedSkillItemString = '';
        for(let i=0; i<this.selectedSkillItems.length; i++){
          this.slectedSkillItemString += this.selectedSkillItems[i].id+',';
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
    
        let res = await Promise.all([locations, skills,genders,languages]);
        
        this.locations = res[0];
        //this.positions = res[1];
        //this.companies = res[2];
        this.skills = res[1];
        this.genders = res[2];
        this.languages = res[3];

        this.dropdownList = this.skills;
        this.dropdownSettings = { 
                singleSelection: false, 
                text:"Select Skills",
                selectAllText:'Select All',
                unSelectAllText:'UnSelect All',
                enableSearchFilter: true,
                classes:"myclass custom-class"
                }; 

        // here you can retrieve promises results,
        // in res[0], res[1], res[2] respectively.
        this.spinner.hide();
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
        }, 15000);
        
      }
      
        openwaitdialogWait(loadingMessage: any = 'Loading', defaultWidth: any = 350) {
        // tslint:disable-next-line: max-line-length
        setTimeout(function(){
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
        }, 2000);
      }


      public findInvalidControls() {
        const invalid = [];
        const controls = this.registerForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        // console.log(invalid);
    }


    // isReferenceCodeAvailable
    // verifyReferenceCodeAvailability
    
    resetReferenceCode()
    {
        this.isReferenceCodeAvailable = false;
    }
    verifyReferenceCodeAvailability(referenceCode)
    {
        this.isReferenceCodeAvailable = true;
        this.RegisterService_
            .verifyReferenceCodeAvailability(referenceCode)
            .subscribe((resp) => {
                // console.log(resp.length);
            if(resp.length==0)
            {
                $("#referenceCode").val('');
                this.isReferenceCodeAvailable = false;
            }

              });
    }

    verifyEmailAvailability(emailAddress)
    {
        this.isEmailAvailable = true;
        this.RegisterService_
            .verifyEmailAvailability(emailAddress)
            .subscribe((resp) => {
                // console.log(resp.length);
            if(resp.length>0)
            {
                $("#emailAddress").val('');
                this.isEmailAvailable = false;
            }

              });
    }
    resetEmailValidation()
    {
        this.isEmailAvailable = true;
    }

    hidePhoneAvailability()
    {
       $("#phoneAvailability").hide();
    }
    
    cancelRegForm()
    {
     this.confirmationDialogService.confirm('Please confirm..', 'Do you want to cancel')
    .then((confirmed) => {if(confirmed){window.location.href = '/';}})
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));

    }

}

