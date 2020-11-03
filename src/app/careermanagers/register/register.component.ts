import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { first } from 'rxjs/operators';
import { RegisterService } from '../../../../_services/register.service';

import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';


declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  registrationPage:boolean =true;
  thankyouPage:boolean = false;
  CMregisterForm: FormGroup;
  submitted = false;
  loading = false;
  loginPage = true;
  imageSrc = '';
  ImageSizeerror:boolean = false;
  ImageTypeeerror:boolean = false;
  ImageRequired:boolean = false;
  ImageWidth:boolean=false;
  winInnerHeight=0;




  role_id = '4';
    constructor(
    private formBuilder: FormBuilder,
    private registerService : RegisterService,
    private router: Router,
    private route: ActivatedRoute,

    
  ) { }

  ngOnInit(): void {

    this.winInnerHeight = window.innerHeight;
    
    this.CMregisterForm = this.formBuilder.group({
      regEmailAddress: ['',
                [
                  Validators.required, 
                  Validators.email,
                  Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
                ]
            ],
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
            phoneNumber: ['', 
                        [
                            Validators.required
                        ]
                ],
                departmentName: ['',
                [
                    Validators.required,
                    Validators.pattern(/^[a-z\d\-_.,\s]+$/i)
                ]
            ],
            collageName: ['',
                [
                    Validators.required,
                    Validators.pattern(/^[a-z\d\-_.,\s]+$/i)
                ]
            ],
            file:['', [Validators.required]],
            fileSource:[]
    });

  }

  get fr() { return this.CMregisterForm.controls; }

  

  processRegistration() {
    this.submitted = true;
  
    if(!this.CMregisterForm.value.file)
    {
      this.ImageRequired = true;
    }
    
    if (this.CMregisterForm.invalid) {
      return;
    }
    
    if(this.ImageRequired)
    {
        return;
    }
    

   this.loading = true;
   
   this.saveCMRegistration();
   // return false;

}

saveCMRegistration()
 {
  
   this.loading = true;
  const formData = new FormData();

  
  let firstName = this.CMregisterForm.value.firstName;
  let lastName = this.CMregisterForm.value.lastName;
  let userName = firstName+'.'+lastName+'@facehiring.com';
  let emailAddress = this.CMregisterForm.value.regEmailAddress; 
  let phoneNumber = this.CMregisterForm.value.phoneNumber.internationalNumber;
  let collageName = this.CMregisterForm.value.collageName;
  let departmentName = this.CMregisterForm.value.departmentName;

  
  formData.append('firstName', firstName);
  formData.append('lastName', lastName);
  formData.append('userName', userName);
  formData.append('emailAddress', emailAddress);
  formData.append('phoneNumber', phoneNumber);
  formData.append('collageName', collageName);
  formData.append('departmentName', departmentName);
  formData.append('role_id', this.role_id);
  formData.append('file', this.CMregisterForm.value.file);
  formData.append('fileSource', this.CMregisterForm.value.fileSource);     
  // formData.append('file', this.registerForm.get('fileSource').value);



  const _that = this;
      this.registerService
    .saveCMRegistration(formData)
    .subscribe((resp) => {
     //  console.log(resp);
     this.loading = false;
     this.registrationPage = false;
     this.thankyouPage = true;
    });

    return false;
 }

resetImage()
{
  this.imageSrc = 'assets/img/p13.png';
  // this.CMregisterForm.value.fileSource = '';
   this.CMregisterForm.value.file = '';

}

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
          this.CMregisterForm.patchValue({
              fileSource: file
          });

          
      
      }, 100);
      };
    } // else 
}  

}


}
