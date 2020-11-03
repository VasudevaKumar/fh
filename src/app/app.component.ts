import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Location } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ssr-serverless';
  platform: string;
  public isHeaderVisible = true;

constructor(@Inject(PLATFORM_ID) private platformId: any, location: Location, router: Router) {
  router.events.subscribe(val => {
    if(location.path() == '/hrpostings')
    {
      this.isHeaderVisible = false;
    }else{
      this.isHeaderVisible = true;
    }
  });
}
public ngOnInit(): void {
    this.platform = isPlatformBrowser(this.platformId) ? 'Browser' : 'Server';
  }
}
