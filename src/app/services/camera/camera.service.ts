import { Injectable, ElementRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})


/**
 * USER CAMERA LIVE VIEW
 * Author: Hugo Melo
 * Email: hugo.melo@outlook.com
 * Version: 0.0.0:20190923
 *
 * DESCRIPTION
 * Access camera and take snap shots through browser with HTML5 video and canvas elements
 * for Augmented reality on knowfoot hybrid app
 *
 * FATURES
 * - Camera live view [✓]
 * - Image capture [✓]
 * - Present preview before salve captured image [✗]
 * - Access the back camera, fall back to default camera [✗]
 * - Auto adjust width, height and center of live view [✗]
 * - Capture image with predefined options TODO: define those option like - rosolution, width, height, quality, mimetype [✗]
 * - Optimization of image data via capture off lossless pixel data for better post-processing. [✗]
 * - Use of WebRTC/UserMedia API TODO: implements WebRTC adpter https://github.com/webrtc/adapter [✗]
 * - TODO: Define better image file format jpg or png smaller size and better quality. [✗]
 */

export class CameraService {
  private videoElement: HTMLVideoElement;
  cameraTracks: MediaStreamTrack[];
  // cameraTrack: MediaStreamTrack;
  constrains: MediaTrackConstraints;

  props = {
    cameraHeight: 160,
    cameraWidth: 120,
    captureHeight: 130,
    captureWidth: 130,
    mimeType: 'image/png',
    imageQuality: 1,
    constraints: {
      width: { ideal: 260 }, // capture width
      height: { ideal: 260 } // capture heigth 
    }
  };

  constructor(private sanitizer: DomSanitizer) { }

  private set cameraPreview(videoElement) { this.videoElement = videoElement; }
  private get cameraPreview() { return this.videoElement; }

  private get cameraHeight() { return this.cameraPreview.height; }
  private get cameraWidth() { return this.cameraPreview.width; }

  public startPreview(videoElement: ElementRef) {
    this.cameraPreview = videoElement.nativeElement;
    // this.adjustScale();
    this.getCameraStream();
  }

  public stopPreview() {
    this.cameraTracks.forEach(track => { track.stop(); });
  }

  public snapShot() {
    const mimeType = 'image/png';
    const quality = 1;

    const canvas = document.createElement('canvas');
    canvas.width = this.props.captureWidth; // this.cameraWidth;
    canvas.height = this.props.cameraHeight; // this.cameraHeight;
    console.log(this.cameraWidth + ' x ' + this.cameraHeight);

    canvas.getContext('2d').
      drawImage(this.cameraPreview, 0, 0, this.cameraWidth, this.cameraHeight);

    const image = canvas.toDataURL(mimeType, quality);
    this.stopPreview();

    return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  // public snap() {
  //   const mimeType = 'image/png';
  //   const quality = 1;

  //   const canvas = document.createElement('canvas');
  //   canvas.width = this.props.captureWidth; // this.cameraWidth;
  //   canvas.height = this.props.cameraHeight; // this.cameraHeight;
  //   console.log(this.cameraWidth + ' x ' + this.cameraHeight);

  //   // print snapshot as image
  //   canvas.getContext('2d').drawImage(this.cameraPreview, 0, 0);

  //   // const image = canvas.toDataURL(mimeType, quality);
  //   // get the ImageData object from the canvas' context.
  //   const image: ImageData = 
  //     canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  //   this.stopPreview();

  //   return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  // }



  private async getCameraStream() {
    try {
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: this.props.constraints });
        this.cameraTracks = stream.getVideoTracks();
        // this.cameraTrack = stream.getVideoTracks()[0];
        this.displayCameraStream(stream);
      }
    } catch (error) {
      console.error(error);
    }
  }

  private displayCameraStream(stream: MediaStream) {
    this.cameraPreview.srcObject = stream;
  }

  adjustScale() {
    // adjust scale if dest_width or dest_height is different
    const scaleX = this.props.cameraWidth / this.props.captureWidth;
    const scaleY = this.props.cameraHeight / this.props.captureHeight;
    if ((scaleX !== 1.0) || (scaleY !== 1.0)) {
      this.cameraPreview.style.transform = `scaleX(${scaleX}) scaleY(${scaleY})`;
    }
  }

  cropAndScale() {
    const props = {
      image: new Image(),
      ratio: 0,
      sw: 0,
      sh: 0,
      sx: 0,
      sy: 0
    }

    // crop and scale image for final size
    props.ratio = Math.min(props.image.width / this.props.captureWidth, props.image.height / this.props.captureHeight);
    props.sw = this.props.captureWidth * props.ratio;
    props.sh = this.props.captureHeight * props.ratio;
    props.sx = (props.image.width - props.sw) / 2;
    props.sy = (props.image.height - props.sh) / 2;

    return props;
  }
}
