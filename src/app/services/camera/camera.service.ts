import { Injectable, ElementRef } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private videoElement: HTMLVideoElement;
  cameraTracks: MediaStreamTrack[];

  props = {
    cameraHeight: 120,
    cameraWidth: 160,
    captureHeight: 160,
    captureWidth: 120,
    mimeType: 'image/png',
    imageQuality: 1,
    constraints: null,
  };

  constructor(private sanitizer: DomSanitizer) { }

  private set cameraPreview(videoElement) { this.videoElement = videoElement; }
  private get cameraPreview() { return this.videoElement; }

  private get cameraHeight() { return this.cameraPreview.height; }
  private get cameraWidth() { return this.cameraPreview.width; }

  public startPreview(videoElement: ElementRef) {
    this.cameraPreview = videoElement.nativeElement;
    this.adjustScale();
    this.getCameraStream();
  }

  public stopPreview() {
    this.cameraTracks.forEach(track => { track.stop(); });
  }

  public snapShot() {
    const mimeType = 'image/png';
    const quality = 1;

    const canvas = document.createElement('canvas');
    canvas.width = this.cameraWidth;
    canvas.height = this.cameraHeight;
    console.log(this.cameraWidth + ' x ' + this.cameraHeight);

    canvas.getContext('2d').
      drawImage(this.cameraPreview, 0, 0, this.cameraWidth, this.cameraHeight);

    const image = canvas.toDataURL(mimeType, quality);
    this.stopPreview();

    return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  private async getCameraStream() {
    try {
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.cameraTracks = stream.getVideoTracks();
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
}
