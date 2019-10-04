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
 * for knowfoot hybrid app
 *
 * FATURES
 * - Camera live view [✓]
 * - Image capture [✓]
 * - Present preview before salve captured image [✓]
 * - Access the back camera, fall back to default camera [✓]
 * - Auto adjust width, height of live view [✓]
 * - Capture image with predefined options: width, height, quality, mimetype [✓]
 * - Optimization of image data via capture off lossless pixel data for better post-processing. [✗]
 * - TODO: Use of WebRTC/UserMedia API TODO: implements WebRTC adpter https://github.com/webrtc/adapter
 * - TODO: Define better image file format jpg or png smaller size and better quality.
 * - TODO: Improve error handling [✗]
 * - TODO: Enumrate enviroment cameras and choose last [✗]
 */

export class CameraService {
  private videoElement: HTMLVideoElement;
  private cameraTracks: MediaStreamTrack[];

  constructor(private sanitizer: DomSanitizer) { }

  private set cameraPreview(videoElement) { this.videoElement = videoElement; }
  private get cameraPreview() { return this.videoElement; }

  private get cameraHeight() { return screen.availHeight - 120; }
  private get cameraWidth() { return screen.availWidth; }

  public startPreview(videoElement: ElementRef) {
    if (!videoElement || !videoElement.nativeElement) {
      return console.error('ERRO: Não foi possivel vincular a camera ao elemento no DOM');
    }
    this.cameraPreview = videoElement.nativeElement;
    this.cameraStream();
  }

  /**
   * Acessa camera do dispositivo e transmite conteudo para elemento de video no DOM
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices
   * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
   * https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints
   * https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTracks
   */
  private async cameraStream(): Promise<void> {
    try {
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        const constraints: MediaTrackConstraints = {
          facingMode: 'enviroment', // acessa camera traseira se disponivel
          // width: screen.availHeight - 120,
          // height: screen.availWidth
          height: screen.availHeight - 120,
          width: screen.availWidth
        };

        // inicia camera e acessa o conteudo transmitido por ela
        const stream = await navigator.mediaDevices.getUserMedia({ video: constraints });
        // mostra conteudo do stream da camera no elemento de video do HTML
        this.cameraPreview.srcObject = stream;
        // armazena todas transmissoes ativas
        this.cameraTracks = stream.getVideoTracks();
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Encerra o acesso a camera
   */
  public stopPreview(): void {
    this.cameraTracks.forEach(track => { track.stop(); });
  }

  /**
   * Captura frame do stream da camera e trata para inserção em background-image no css
   * @returns url com dataURL base64 da imagem sanitizada para inserção no DOM
   */
  public snapShot(): SafeStyle {
    const canvas = this.drawCanvas(this.cameraPreview, this.cameraWidth, this.cameraHeight);
    // const canvas = this.drawCanvas(this.cameraPreview, 200, 200);
    this.stopPreview();
    const image = canvas.toDataURL('image/png', 1);

    return this.sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }


  /**
   * Ajusta/captura imagem para tamanho solicitado dentro do elemento canvas
   *
   * @param image imagem que será pintada no canvas
   * @param width largura final da imagem
   * @param height altura final da imagem
   * @returns elemento canvas com imagem pintada
   *
   * https://www.nashvail.me/blog/canvas-image/
   * https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
   * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
   * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect
   * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
   */
  private drawCanvas(image, width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const canvasContext = canvas.getContext('2d');
    canvasContext.clearRect(0, 0, width, height);

    if (image.width !== width && image.height !== height) {
      // console.log('escalado');
      const ratio = Math.min(image.width / width, image.height / height);
      const sw = width * ratio; // largura que sera retirada da imagem original
      const sh = height * ratio; // altura que sera retirada da imagem original
      const sx = (image.width - sw) / 2; // quanto será recortado a esquerda de forma a centralizar imagem final
      const sy = (image.height - sh) / 2; // quanto será recortado acima de forma a centralizar imagem final
      canvasContext.drawImage(image, sx, sy, sw, sh, 0, 0, width, height);
    } else {
      // console.log('nao escalado');
      canvasContext.drawImage(image, 0, 0, width, height);
    }
    return canvas;
  }

  // TODO: smartphones hj podem ter mais de uma camera traseira.
  // Pegar cameras traseiras disponiveis e escolher a ultima pois,
  // provavelmente será a camera padrao normal
  // detectAvailableCameras > switchToLastVideoInput 

  // async getDeviceList () {
  //   await navigator.mediaDevices.getUserMedia({
  //     video: true,
  //     audio: true
  //   })

  //   deviceList = await navigator.mediaDevices.enumerateDevices();
  //   cameraList = deviceList.filter(item => item.kind === 'videoinput');
  //   cameraInfoMap = new Map(cameraList.map(info => [info.deviceId, info]));
  // }

  // TODO verificar o sistema do usuario para saber se acesso é por smartphone
  // get isAndroid() {
  //   return /Android/i.test(navigator.userAgent);
  // }

  // get isiOS() {
  //   return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  // }

  // get isIosSafari() {
  //   return /iPhone/.test(navigator.userAgent) &&
  //     /Safari/.test(navigator.userAgent) &&
  //     !(/CriOS/.test(navigator.userAgent)) &&
  //     !(/FxiOS/.test(navigator.userAgent));
  // }

  // get isMobile() {
  //   return this.isAndroid || this.isiOS;
  // }



}
