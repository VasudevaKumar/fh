import { Component, OnInit, TemplateRef,ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from './../../../_services/employee.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgxSpinnerService } from "ngx-spinner";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'; 
import { Subscription, timer , interval} from 'rxjs';
import _ from 'lodash';

declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-jspostings',
  templateUrl: './jspostings.component.html',
  styleUrls: ['./jspostings.component.css']
})
export class JspostingsComponent implements OnInit {

  @ViewChild('myFileInput') myFileInput;

  modalRef: BsModalRef;  
  subscription: Subscription;
  imageChangedEvent: any = '';
  imageChangedEventR:any = '';

  croppedImage: any = '';

  HomPageForm: FormGroup;
  HomePagePostForm:FormGroup;

  loggedInEmployeeID:any;
  currentUser:any;
  employeeProfiles=[];
  peopleWhoMayKnow=[];
  employeeHomePagePics=[];
  postComments=[];
  totalConnects = [];
  profileViewDetails = [];
  postLikeDetails = [];
  intervelPostComments = [];

  isEmployeeProfileLoaded = false;
  ImageSizeerror:boolean = false;
  ImageTypeeerror:boolean = false;
  isPostEmpty = false;
  public thoughts = '';
  public isHomePicUploaing:boolean = false;
  public issueInPost = false;
  fileToReturn:any;
  data:any;
  public isAddPost:boolean = false;

  imageSrcLeft: string;
  imageSrcRight: string;

  isContentLoaded = false;
  viewDetails = '';
  postMessage = '';


  public imagePath;
  public imgURL: any;
  public message: string;
  
  public lastPostDate:any  = new Date();


  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [
        'fontName', 
        'heading',
        'customClasses',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  constructor(
    private router: Router,
    private EmployeeService_:EmployeeService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService
    
) {
    // redirect to home if already logged in
}


  ngOnInit(): void {
    
    this.spinner.show();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loggedInEmployeeID  = this.currentUser[0].user_id;
    this.loadContent(this.loggedInEmployeeID);
    // console.log(this.loggedInEmployeeID);
    this.lastPostDate.setSeconds(0, 0);
    this.lastPostDate = this.lastPostDate.toISOString().replace(/T/, " ").replace(/:00.000Z/, "");
    this.HomPageForm = this.formBuilder.group({
      leftSideFile: [],
      leftSidefileSource:[],
      rightSideFile:[],
      rightSidefileSource:[]
    });

    this.HomePagePostForm = this.formBuilder.group({
      frm_uploadImageFile: [],
      uploadImageSource:[]

    });

   
    this.subscription= interval(40000).subscribe((x =>{
      this.getIntervalPosts();
    }));
   
   

 }
 get f() { return this.HomPageForm.controls; }

  getEmployeeProfile(employeeID)
  {
        const _that = this;
        this.EmployeeService_
      .getEmployeeHomDetails(employeeID)
      .subscribe(employeeProfiles => (_that.employeeProfiles = employeeProfiles))
      .add(() => {
        /*console.log(_that.employeeProfiles['profileData'][0].firstName);*/
       // console.log(_that.employeeProfiles);
       _that.isEmployeeProfileLoaded = true;
      });

    }

    fn_leftSidePrfilePic()
    {
       document.getElementById('leftSideFile').click();
    }
    fn_rightSidePrfilePic()
    {
      document.getElementById('rightSideFile').click();
    }
    fn_UploadImagePost()
    {
      this.issueInPost = false;
      this.isPostEmpty = false;
      
      document.getElementById('uploadImageFile').click();

    }
    onUploadImageFileChange(event){
      let reader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      var pattern = /image-*/;
      if (!file.type.match(pattern)) {
          this.ImageTypeeerror = true;
          return;
        }

        let img = new Image();
      img.src = window.URL.createObjectURL( file );
      reader.readAsDataURL(file);
      reader.onload = (event:any) => {
          setTimeout(() => {
          const width = img.naturalWidth;
          const height = img.naturalHeight;
          window.URL.revokeObjectURL( img.src );
          // console.log(width + '*' + height);
           // console.log(event.target);

              this.ImageSizeerror = false;
              var canvas=document.createElement("canvas");
              var context=canvas.getContext("2d");
              // defining cause it wasnt
                var maxWidth = 550,
                    maxHeight = 175;
                 
                  this.HomePagePostForm.patchValue({
                      uploadImageSource: file
                  });

                 this.postImage();
        
          }, 100);
          };
  }  
}
 
    async loadContent(employeeID)
    {
      const _that = this;
      const res1 = this.EmployeeService_.getPostingPageInfo(employeeID).toPromise();
      const res2 = this.EmployeeService_.getPosts(employeeID).toPromise();

      /*
      const res1 = this.EmployeeService_.getEmployeeHomDetails(employeeID).toPromise();
      const res2 = this.EmployeeService_.getPeopleWhoMayKnow(employeeID).toPromise();
      const res3 = this.EmployeeService_.getEmployeeHomePics(employeeID).toPromise();
      
      const res5 = this.EmployeeService_.gettotalConnects(employeeID).toPromise();
      */

      let res = await Promise.all([res1, res2]);
      //let res = await Promise.all([res1, res4]);
      _that.employeeProfiles = res[0]['HomeDetails'];
      _that.peopleWhoMayKnow = res[0]['peopleMayKnow'];
      _that.employeeHomePagePics = res[0]['employeeHomePics'];
      _that.totalConnects = res[0]['totalConnects'];
      _that.postComments = res[1];
      
      
      _that.isEmployeeProfileLoaded = true;

      if(this.employeeHomePagePics.length > 0)
      {
        this.imageSrcLeft = this.employeeHomePagePics[0].leftsideimagepath;
        this.imageSrcRight = this.employeeHomePagePics[0].rightsideimagepath;
      }

     // console.log(_that.postComments);
     // console.log(_that.employeeHomePagePics);

     this.spinner.hide();
     if(_that.postComments.length > 0)
     {
      this.lastPostDate = _that.postComments.sort((a,b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
      this.lastPostDate = this.lastPostDate.posts.updated_at;
     }

      this.isContentLoaded = true;
      // console.log(this.lastPostDate.posts.created_at);
      // _that.imageSrcLeft =  _that.isEmployeeProfileLoaded.data

    }

    submitForm(type)
    {
      this.isHomePicUploaing = true;
      $('#overlay').fadeIn();
      //  this.openwaitdialog('<img src="assets/img/loading.gif">',200);
      if(type == 'left')
      {
        const formData = new FormData();
        formData.append('leftSidefileSource', this.HomPageForm.value.leftSidefileSource);  
        formData.append('loggedInUser', this.loggedInEmployeeID);      
      //   formData.append('leftSidefile', this.HomPageForm.get('leftSidefileSource').value);
        const _that = this;
              this.EmployeeService_
              .uploadHomePageFileL(formData)
              .subscribe((resp) => {
                //console.log(resp);
              })
              .add(() => {
               //  this.spinner.hide();
               this.isHomePicUploaing = false;
               $('#overlay').fadeOut();
              });
      }
      if(type == 'right')
      {
        const formData = new FormData();
        formData.append('rightSidefileSource', this.HomPageForm.value.rightSidefileSource);  
        formData.append('loggedInUser', this.loggedInEmployeeID);      
      //   formData.append('leftSidefile', this.HomPageForm.get('leftSidefileSource').value);
        const _that = this;
              this.EmployeeService_
              .uploadHomePageFileR(formData)
              .subscribe((resp) => {
                //console.log(resp);
              })
              .add(() => {
               // this.spinner.hide();
               this.isHomePicUploaing = false;
               $('#overlay').fadeOut();
              });
      }

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

    pushComment(commentNotes , key , postID, event)
    {
      this.postComments[key]['posts']['comments'].push({
        comments: commentNotes,
        companyName: "",
        created_at: new Date(),
        firstName: this.employeeProfiles[0].firstName,
        id: 1,
        imageProfile: this.employeeProfiles[0].imageProfile,
        lastName: this.employeeProfiles[0].lastName,
        positionName: "",
        post_id: postID,
        user_id: this.loggedInEmployeeID
      });
      let cnt = $("#commentDiv_"+postID).text();
      $("#commentDiv_"+postID).html(parseInt(cnt)+1);

      this.lastPostDate = new Date();
      this.lastPostDate.setSeconds(0, 0);
      this.lastPostDate = this.lastPostDate.toISOString().replace(/T/, " ").replace(/:00.000Z/, "");
      this.EmployeeService_.pushComments(this.loggedInEmployeeID , postID , commentNotes).toPromise();
      this.clearValue(event);
    }

    clearValue(event)
    {
      this.isPostEmpty = false;
      this.issueInPost = false;
      event.target.value='';
    }

    submitPost()
    {
      this.isPostEmpty = false;
      this.issueInPost = false;
      // console.log(this.thoughts);

      if(this.thoughts == '')
      {
        this.isPostEmpty = true;
      }
      
      if(this.thoughts != '')
      {
        this.isPostEmpty = false;
        this.pushTextPost();
      }

    }

    postImage()
    {
      
      let imageCommentVal = $("#imageComments").val();

      this.isHomePicUploaing = true;
      $('#overlay').fadeIn();
      const formData = new FormData();
      formData.append('uploadImageSource', this.HomePagePostForm.value.uploadImageSource); 
      formData.append('imageComments', imageCommentVal);       
      formData.append('loggedInUser', this.loggedInEmployeeID);      
    //   formData.append('leftSidefile', this.HomPageForm.get('leftSidefileSource').value);
      const _that = this;
            this.EmployeeService_
            .postImage(formData)
            .subscribe((resp) => {})
            .add(() => {
              _that.modalRef.hide();
              this.myFileInput.nativeElement.value = '';
              /*console.log(_that.employeeProfiles['profileData'][0].firstName);*/
              this.postMessage = 'Your photo has been posted';
              this.isAddPost = true;
              this.postComments= [];
              this.getPosts();
            });
              

    }

    pushTextPost()
    {
      
      this.isHomePicUploaing = true;
      $('#overlay').fadeIn();
     const _that = this;
        this.EmployeeService_
      .pushPost(this.loggedInEmployeeID , this.thoughts)
      .subscribe((resp) => {
          if(resp.msg == 'fail')
          {
            this.issueInPost = true;
          }
      })
      .add(() => {
        this.thoughts = '';
        // $("#successfulPost").show().delay(5000).fadeOut();
        /*console.log(_that.employeeProfiles['profileData'][0].firstName);*/
        this.postMessage = '';
        this.isAddPost = true;
        this.postComments= [];
        this.getPosts();
      });


    }

    getPosts()
    {
      const _that = this;
      this.EmployeeService_
    .getPosts(this.loggedInEmployeeID)
    .subscribe(postComments => (_that.postComments = postComments))
    .add(() => {
      /*console.log(_that.employeeProfiles['profileData'][0].firstName);*/
      // console.log(_that.postComments);
      if(this.isAddPost)
      {
        $("#successfulPost").html(this.postMessage);
        $("#successfulPost").show().delay(5000).fadeOut();
        this.isAddPost = false;
      }
      this.isHomePicUploaing = false;
      
      $('#overlay').fadeOut();

      if(_that.postComments.length > 0)
     {
      this.lastPostDate = _that.postComments.sort((a,b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
      this.lastPostDate = this.lastPostDate.posts.updated_at;
      // console.log(this.lastPostDate);
     }


    });

    }


    getIntervalPosts()
    {
      const _that = this;
      _that.intervelPostComments = [];
      this.EmployeeService_
    .getIntervalPosts(this.loggedInEmployeeID , this.lastPostDate)
    .subscribe(intervelPostComments => (_that.intervelPostComments = intervelPostComments))
    .add(() => {
     
     // _that.postComments.push(..._that.intervelPostComments);
     
     // _that.postComments = _.uniqBy([..._that.postComments, ..._that.intervelPostComments], 'id');

     // console.log(_that.postComments);


     if(_that.intervelPostComments.length > 0)
     {

      let newArray = _that.postComments.filter(function(objFromA) {
        return !_that.intervelPostComments.find(function(objFromB) {
          return objFromA.posts.id === objFromB.posts.id
        })
      });

      _that.postComments = _that.intervelPostComments.concat(newArray);
      this.lastPostDate = _that.intervelPostComments.sort((a,b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
      this.lastPostDate = this.lastPostDate.posts.updated_at;
     }

    });

    }


    removeDuplicates(originalArray, prop) {
      var newArray = [];
      var lookupObject  = {};
 
      for(var i in originalArray) {
         lookupObject[originalArray[i][prop]] = originalArray[i];
      }
 
      for(i in lookupObject) {
          newArray.push(lookupObject[i]);
      }
       return newArray;
  }

    
    postSharing(postID, shareCount)
    {
       // alert(postID);
       this.isHomePicUploaing = true;
       $('#overlay').fadeIn();
       
       const _that = this;
       this.EmployeeService_
     .postSharing(postID , this.loggedInEmployeeID)
     .subscribe((resp) => {})
     .add(() => {
      this.isHomePicUploaing = false;
      $('#overlay').fadeOut();
      $("#shareDiv_"+postID).html(parseInt(shareCount)+1);
     });


    }

    postLike(postID , likeCount)
    {
       // this.openwaitdialog('<img src="assets/img/loading.gif">', 200);
       this.isHomePicUploaing = true;
       $('#overlay').fadeIn();
        const _that = this;
        this.EmployeeService_
      .postLike(postID , this.loggedInEmployeeID)
      .subscribe((resp) => {})
      .add(() => {
        //this.closewaitdialog();
        this.lastPostDate = new Date();
        this.lastPostDate.setSeconds(0, 0);
        this.lastPostDate = this.lastPostDate.toISOString().replace(/T/, " ").replace(/:00.000Z/, "");

        this.isHomePicUploaing = false;
        $('#overlay').fadeOut();
        $("#likeDiv_"+postID).html(parseInt(likeCount)+1);        
      });

      /* Update Like */

      /*
      this.changeLik(postID , 'Y');

      _that.postComments = _that.postComments.map(obj =>
          obj.id === postID ? { ...obj, isLiked: 'Y' } : obj
      );
      

    console.log(_that.postComments);
     _that.postComments.find(v => v.id === postID).isLiked = 'Y';
*/
    
     this.changeLik(postID , 'Y');
    }

    changeLik( postID, st ) {
      const _that = this;

      for (var i in _that.postComments) {
        if (_that.postComments[i]['posts'].id == postID) {
          _that.postComments[i]['posts'].isLiked = st;
           break; //Stop this loop, we found it!
        }
      }
   }


    displayMessage(postID)
    {
      $("#commentPost_"+postID).toggle();
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
        width: 1200,
        height: 600,
        zIndex: 10000,
        resizable: false,
        buttons: {
        'Save': function() {
                // Save code here
                $('#imageCropDailogL').dialog('close');
               _that.submitForm('left');
          }
      
      },
        close: function() {
         // _that.submitForm('left');
        // _that.imageSrcLeft = '';
        }
      });
    }


    onRightSidePicChange(event: any): void {
      this.openDialogR();
      this.imageChangedEventR = event;
   }

 imageCroppedR(event: ImageCroppedEvent) {
  this.imageSrcRight = event.base64;
   this.fileToReturn = this.base64ToFile(
    event.base64,
    this.imageChangedEventR.target.files[0].name,
  )
  this.HomPageForm.patchValue({
    rightSidefileSource: this.fileToReturn
  });
}
 imageLoadedR() {
        // show cropper
}
cropperReadyR() {
        // cropper ready
 }
  loadImageFailedR() {
        // show message
 }

  
    
    openDialogR()
    {
      let _that = this;
     $('#imageCropDailogR').dialog({
       modal: true,
       title: 'Crop your image',
        width: 1200,
        height: 600,
        zIndex: 10000,
        resizable: false,
        buttons: {
        'Save': function() {
                // Save code here
                $('#imageCropDailogR').dialog('close');
               _that.submitForm('right');
          }
      },
        close: function() {
         // _that.submitForm('left');
         //_that.imageSrcRight = '';
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

    deletePost(postID)
    {
      // alert(postID);

      // this.postComments['posts'] = this.postComments['posts'].filter( ({ id }) => id != postID);
      this.isHomePicUploaing = true;
       $('#overlay').fadeIn();
      const _that = this;
      this.EmployeeService_.deletePost(postID)
      .subscribe(postComments => (_that.postComments = postComments))
    .add(() => {
      /*console.log(_that.employeeProfiles['profileData'][0].firstName);*/
      this.isAddPost = false;
        this.getPosts();
    });

    }
    closeModel(userID)
    {
      this.modalRef.hide();
      this.showProfile(userID);
    }
    showProfile(userID)
    {
      // this.router.navigate(['/profile/myProfile']);
      localStorage.setItem('searchUser', userID);
      this.router.navigate(['/jsregister/profile']);
    }

    preventDefault()
    {
      return false;
    }

    fn_profilView(template: TemplateRef<any>) {  
      
      this.spinner.show();
        
        const _that = this;
        this.EmployeeService_.profileViews(this.loggedInEmployeeID)
        .subscribe(profileViewDetails => (_that.profileViewDetails = profileViewDetails))
      .add(() => {
        
//         console.log(_that.profileViewDetails);
          this.spinner.hide();
          _that.modalRef = this.modalService.show(  
            template,  
            Object.assign({}, { class: 'gray modal-lg' })  
            );  
                    
                });
              
      /*
       this.modalRef = this.modalService.show(  
         template,  
          Object.assign({}, { class: 'gray modal-lg' })  
          );  
        
        */
      } 

      fn_likesView(template: TemplateRef<any>, postID:any) {  
        
        this.spinner.show();
        const _that = this;
        this.EmployeeService_.postLikes(postID)
        .subscribe(postLikeDetails => (_that.postLikeDetails = postLikeDetails))
      .add(() => {
        this.spinner.hide();
//         console.log(_that.profileViewDetails);
          _that.modalRef = this.modalService.show(  
            template,  
            Object.assign({}, { class: 'gray modal-lg' })  
            );  
                    
                });

      /*
       this.modalRef = this.modalService.show(  
         template,  
          Object.assign({}, { class: 'gray modal-lg' })  
          );  
        
        */
      } 

      deleteLImage()
      {
        this.isHomePicUploaing = true;
        $('#overlay').fadeIn();
        this.imageSrcLeft = '';
        const _that = this;
          this.EmployeeService_.deleteLeftImage(this.loggedInEmployeeID)
          .subscribe()
          .add(() => {
            this.isHomePicUploaing = false;
            $('#overlay').fadeOut();
            });
      }
      deleteRImage(){
        this.isHomePicUploaing = true;
       $('#overlay').fadeIn();
        this.imageSrcRight = '';
        const _that = this;
          this.EmployeeService_.deleteRightImage(this.loggedInEmployeeID)
          .subscribe()
          .add(() => {
            this.isHomePicUploaing = false;
            $('#overlay').fadeOut();
            });
      }

   
      preview(template: TemplateRef<any>, files:any) {  
        const _that = this;
      // this.myFileInput.nativeElement.value = '';
        // this.spinner.show();

        if (files.length === 0)
          return;
     
        var mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
         // this.spinner.hide();
          this.message = "Only images are supported.";
          return;
        }
     
        var reader = new FileReader();
        this.imagePath = files;
        let img = new Image();
        img.src = window.URL.createObjectURL( files[0] );

        reader.readAsDataURL(files[0]); 
        reader.onload = (_event) => { 
          this.imgURL = reader.result; 
          
          const width = img.naturalWidth;
          const height = img.naturalHeight;
          const newModalWidth = width +10;
          // console.log('new wid' + newModalWidth);
          // $(".modal-lg").css({'maxWidth':newModalWidth});
          this.HomePagePostForm.patchValue({
            uploadImageSource: files[0]
        });

         // this.spinner.hide();
        }

          _that.modalRef = this.modalService.show(  
            template,  
            Object.assign({}, { class: 'gray modal-lg' })  
            );  

            

                    
        

      /*
       this.modalRef = this.modalService.show(  
         template,  
          Object.assign({}, { class: 'gray modal-lg' })  
          );  
        
        */

       // this.myFileInput.nativeElement.value = '';

      } 

      

      /*
      ngAfterViewChecked()
      {
        const _that = this;
        console.log('after content initiated');

          $('#txtImages img').each(function() {
            console.log('one');
           var str = ($(this).attr("src"));
            var pos = str.indexOf(';base64,');
            var type = str.substring(5, pos);
            var b64 = str.substr(pos + 8);

            //_that.resizeBase64Img($(this).attr("src"), 545 , 545);

            _that.resizeBase64Img(b64, 100, 100).then(function(newImg){
              
            $("body").append(newImg);
        });

        });
      }

        resizeBase64Img(base64, width, height) {
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext("2d");
        var deferred = $.Deferred();
        $("<img/>").attr("src", "data:image/gif;base64," + base64).load(function() {
            context.scale(width/this.width,  height/this.height);
            context.drawImage(this, 0, 0); 
            deferred.resolve($("<img/>").attr("src", canvas.toDataURL()));               
        });
        return deferred.promise();    
    }

      imageLoaded() {
        var w = $(this).width();
        var h = $(this).height();
        var parentW = $(this).parent().width();
        var parentH = $(this).parent().height();

       // console.log(w + '-' + h + '-' + parentW + '-' + parentH);
        
        if (w >= parentW){ //always true because of CSS
          if (h > parentH){
            $(this).css('top', -(h-parentH)/2);
          } else if (h < parentH){
            $(this).css('height', parentH).css('width', 'auto');
            $(this).css('left', -($(this).width()-parentW)/2);
          }
        }
     }
     */


    ngOnDestroy() {
      if(this.subscription && !this.subscription.closed)
      {
        this.subscription.unsubscribe();
      }
    }
    
}
