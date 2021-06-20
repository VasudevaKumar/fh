import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef
} from '@angular/core';

import videojs from 'video.js';
import * as adapter from 'webrtc-adapter/out/adapter_no_global.js';
import * as RecordRTC from 'recordrtc';

import { FormBuilder, FormGroup,Validators } from "@angular/forms";
import { FileUploadService } from "../../../_services/file-upload.service";
import { HttpEvent, HttpEventType } from '@angular/common/http';

import * as Record from 'videojs-record/dist/videojs.record.js';

import {MatStepperModule} from '@angular/material/stepper';
import { EmployeeService } from '../../../_services/employee.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-jsvideo',
  templateUrl: './jsvideo.component.html',
  styleUrls: ['./jsvideo.component.css']
})
export class JsvideoComponent implements OnInit {
  isEditable = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  loggedInEmployeeID:any;
  currentUser:any;
  videoUrl:any;
  isCreate = true;
  isExiting = false;
  videodetails = [];
  videoFile:any;
  isReadyToPublish = false;
  successmsg = '';

  // reference to the element itself: used to access events and methods
  private _elementRef: ElementRef

  // index to create unique ID for component
  idx = 'clip1';

  private config: any;
  private player: any; 
  private plugin: any;


  form: FormGroup;
  progress: number = 0;


  constructor(
              private _formBuilder: FormBuilder,
              elementRef: ElementRef,
              public fb: FormBuilder,
              public fileUploadService: FileUploadService,
              public _EmployeeService:EmployeeService,
              private spinner: NgxSpinnerService,
              ) { }

  ngOnInit(): void {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.loggedInEmployeeID  = this.currentUser[0].user_id;
    this.myvideo(this.loggedInEmployeeID);

    this.videoUrl = '';
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]});


    
    this.player = false;
    // save reference to plugin (so it initializes)
    this.plugin = Record;
    // video.js configuration
    this.config = {
      controls: true,
      autoplay: false,
      fluid: false,
      loop: false,
      width: 320,
      height: 240,
      bigPlayButton: false,
      controlBar: {
        volumePanel: false
      },
      plugins: {
        /*
        // wavesurfer section is only needed when recording audio-only
        wavesurfer: {
            backend: 'WebAudio',
            waveColor: '#36393b',
            progressColor: 'black',
            debug: true,
            cursorWidth: 1,
            displayMilliseconds: true,
            hideScrollbar: true,
            plugins: [
                // enable microphone plugin
                WaveSurfer.microphone.create({
                    bufferSize: 4096,
                    numberOfInputChannels: 1,
                    numberOfOutputChannels: 1,
                    constraints: {
                        video: false,
                        audio: true
                    }
                })
            ]
        },
        */
        // configure videojs-record plugin
        record: {
          audio: true,
          video: true,
          debug: true,
          maxLength: 120

        }
      }
    };

    this.form = this.fb.group({
      name: [''],
      avatar: [null]
    })

  }

  public myvideo(employeeID)
    {
        const _that = this;
        this._EmployeeService
      .myvideo(employeeID)
      .subscribe(videodetails => (_that.videodetails = videodetails))
      .add(() => {
        
        if(_that.videodetails.length > 0)       
        {
          this.videoUrl = _that.videodetails[0]['videopath'];
        }

      });

    }

  // use ngAfterViewInit to make sure we initialize the videojs element
  // after the component template itself has been rendered
  ngAfterViewInit() {
    // ID with which to access the template's video element
    let el = 'video_' + this.idx;

    // setup the player via the unique element ID
    this.player = videojs(document.getElementById(el), this.config, () => {
      console.log('player ready! id:', el);

      // print version information at startup
      var msg = 'Using video.js ' + videojs.VERSION +
        ' with videojs-record ' + videojs.getPluginVersion('record') +
        ' and recordrtc ' + RecordRTC.version;
      videojs.log(msg);
    });

    // device is ready
    this.player.on('deviceReady', () => {
      console.log('device is ready!');
    });

    // user clicked the record button and started recording
    this.player.on('startRecord', () => {
      console.log('started recording!');
    });

    // user completed recording and stream is available
    this.player.on('finishRecord', () => {
      // recordedData is a blob object containing the recorded data that
      // can be downloaded by the user, stored on server etc.
       // console.log('finished recording: ', this.player.recordedData);
       // this.player.record().saveAs({'video': 'my-video-file-name.webm'});
       this.videoFile = this.player.recordedData;
       this.isReadyToPublish = true;
       this.firstFormGroup.controls['firstCtrl'].setValue('Yes');

    });

    // error handling
    this.player.on('error', (element, error) => {
      console.warn(error);
    });

    this.player.on('deviceError', () => {
      console.error('device error:', this.player.deviceErrorCode);
    });
  }

  // use ngOnDestroy to detach event handlers and remove the player
  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
      this.player = false;
    }
  }


  uploadFile(event) {
    this.videoUrl = '';
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      avatar: file
    });
    this.form.get('avatar').updateValueAndValidity()
  }

  submitVideo() {
    this.fileUploadService.addVido(
      this.form.value.name,
      this.form.value.avatar,
      this.loggedInEmployeeID
    ).subscribe((event: HttpEvent<any>) => {
      
      console.log(event);

      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`Uploaded! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          console.log('User successfully created!', event.body);
          this.videoUrl = event.body.data.msg;
          setTimeout(() => {
            this.progress = 0;
         }, 1500);

      }
    })
    .add(() => {
      this.secondFormGroup.controls['secondCtrl'].setValue('Yes');
     });
  }

  showNew()
  {
    this.isCreate = true;
    this.isExiting = false;
    window.location.reload();
  }

  showExisting()
  {
    this.isExiting = true;
    this.isCreate = false;
  }

  reset()
  {
    this.isCreate = true;
    this.isExiting = false;
    window.location.reload();
  }

  publish()
  {
    const _that = this;
    this.spinner.show();
    // console.log(this.videoFile.name);
    var data = this.player.recordedData;
    var formData = new FormData();
    formData.append('avatar', data, data.name);
    formData.append('employeeID', this.loggedInEmployeeID);
    console.log('uploading recording:', data.name);
    this._EmployeeService.addVideo(formData).subscribe(videodetails => (_that.videodetails = videodetails))
    .add(() => {
      
      _that.isReadyToPublish = false;
      _that.successmsg = 'Your video has been upload successfully';
      this.spinner.hide();
        // console.log(_that.videodetails[0]);
        // console.log(_that.videodetails.videopath);

      if(_that.videodetails.length >0)       
      {
        this.videoUrl = _that.videodetails[0].videopath;
      }

    });
  }
}
