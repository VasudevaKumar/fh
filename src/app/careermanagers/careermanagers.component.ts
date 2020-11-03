import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { first } from 'rxjs/operators';
import { RegisterService } from '../../../_services/register.service';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-careermanagers',
  templateUrl: './careermanagers.component.html',
  styleUrls: ['./careermanagers.component.css']
})
export class CareermanagersComponent implements OnInit {

  isContentLoaded = false;
  careermanagerdetails = [];

  constructor(
    private formBuilder: FormBuilder,
    private registerService : RegisterService,
    private router: Router,
    private route: ActivatedRoute,

    
  ) { }

  ngOnInit(): void {
    this.getCareerManagerDetails();
  }
  getCareerManagerDetails()
  {
    $('#overlay').fadeIn();
        const _that = this;
        this.registerService
      .getCareerManagerDetails()
      .subscribe(careermanagerdetails => (_that.careermanagerdetails = careermanagerdetails))
      .add(() => {
        this.isContentLoaded = true;
        $('#overlay').fadeOut();
          console.log(this.careermanagerdetails);

      });
  }
}
