import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  /**
   * configurações do slide
   * http://idangero.us/swiper/api/
   */
  userOnboardOpts = {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 10000,
      disableOnInteraction: false,
    },
  };

  constructor() { }

  ngOnInit() {
  }

}
