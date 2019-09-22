import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeStyle } from '@angular/platform-browser';
import { CameraService } from '../../services/camera/camera.service';
@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cameraStream', { static: false })
  private cameraStream: ElementRef;

  // @ViewChild('snapShot', { static: false })
  // private elementSnapShot: ElementRef;

  // cameraTracks;

  image;

  constructor(
    private sanitizer: DomSanitizer,
    private camera: CameraService
    ) { }

  ngOnInit() {
    // this.camera.start();
    // console.log(this.elementCameraStream.nativeElement);
    // this.camera.cameraPreview = this.elementCameraStream.nativeElement;
    // this.camera.start();
    // this.cameraStart();
  }

  ngAfterViewInit() {
    this.camera.startPreview(this.cameraStream);
  }

  ngOnDestroy(): void {
    // this.cameraStop();
  }

  // get cameraStream() { return this.elementCameraStream.nativeElement; }
  // // get snapShot() { return this.elementSnapShot.nativeElement; }
  // get cameraHeight() { return this.cameraStream.height; }
  // get cameraWidth() { return this.cameraStream.width; }

  // async cameraStart() {
  //   try {
  //     if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
  //       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //       this.cameraTracks = stream.getVideoTracks();
  //       this.displayStream(stream);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // displayStream(stream: MediaStream) {
  //   this.cameraStream.srcObject = stream;
  // }

  takeSnapShot() {
    this.image = this.camera.snapShot();
  }

  // async takeSnapShot() {
  //   const mimeType = 'image/png';
  //   const quality = 1;
  //   const encoding = 'base64';

  //   const canvas = document.createElement('canvas');
  //   canvas.width = this.cameraWidth;
  //   canvas.height = this.cameraHeight;

  //   await canvas.getContext('2d').
  //     drawImage(this.cameraStream, 0, 0, this.cameraWidth, this.cameraHeight);

  //   const image = canvas
  //     .toDataURL(mimeType, quality);
  //     // .replace(`data:${mimeType};${encoding},`, '');
  //   // console.log(imageBase64);
  //   this.cameraStop();
  //   this.processImage(image);
  //   // return imageBase64;
  // }

  // processImage(cameraResult) {
  //   this.image = this.sanitizer
  //   // .bypassSecurityTrustStyle(`url(data:image/png;base64,${cameraResult})`);
  //   .bypassSecurityTrustStyle(`url(${cameraResult})`);

  // }

  // cameraStop() {
  //   this.cameraTracks.forEach(track => {
  //     track.stop();
  //   });
  // }




}
