import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { AssessFpi } from '../../models/interfaces/assess-fpi';
import { FootSide } from '../../models/enums/foot.enum';


@Injectable({
  providedIn: 'root'
})
export class AssessFpiService {
  /** ID do usuário */
  private userId: string;

  /** Caminho para a coleção de avaliações dos atletas no firestore */
  private assessCollection: AngularFirestoreCollection<AssessFpi>;

  constructor(
    public afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private fireStorage: AngularFireStorage
  ) {
    /**
   * Pegando `user.uid`.
   * Definindo caminho da coleção de atletas no firestore.
   * Fazendo uma query que retorne atletas ativos e ordenados
   * por ordem alfabetica.
   *
   * OBS. usando requisição assincrona do subscribe para evitar
   * que o `user` retorne null quando inicializar o serviço e
   * também evitar que os dados recebidos fiquem em cache
   * caso o usuario faça logout e outro usuario faça login no mesmo
   * dispositivo.
   *
   * https://firebase.google.com/docs/firestore/query-data/indexing
   */
    this.afAuth.authState.subscribe(user => {
      this.userId = user.uid;
      // this.assessCollection = this.firestore.collection<AssessFpi>(`/userProfile/${user.uid}/athletes/${athleteId}`);
    });
  }

  /**
 * 
 * @param assess objeto com as informações da avaliação do atleta
 */
  // async createAssess(assess: AssessFpi): Promise<any> {
  //   try {
  //     this.assessCollection = this.firestore.collection<AssessFpi>(`/userProfile/${this.userId}/athletes/${assess.athleteId}/assess`);

  //     assess.assessId = await this.firestore.createId();
  //     assess.createdAt = await firebase.firestore.FieldValue.serverTimestamp();
  //     assess.updatedAt = assess.createdAt;
  //     assess.isDeleted = false;

  //     const footPicturesLeft = Object.entries(assess.footLeft.footPicture);
  //     const footPicturesRight = Object.entries(assess.footLeft.footPicture);
  //     const storagePath = `${this.userId}/${assess.athleteId}/${assess.assessId}/`;

  //     for (const [view, picture] of footPicturesLeft) {
  //       if (picture.blob !== undefined) {
  //         assess.footLeft.imageUrl[view] = this.uploadFootPicture(view, storagePath, picture.blob, picture.metadata, 'Left');
  //       }
  //     }

  //     for (const [view, picture] of footPicturesRight) {
  //       if (picture.blob !== undefined) {
  //         assess.footLeft.imageUrl[view] = this.uploadFootPicture(view, storagePath, picture.blob, picture.metadata, 'Right');
  //       }
  //     }


  //     return await this.assessCollection.doc(assess.assessId).set(assess);
  //     // return athlete.id;
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // }

  verifyPictures(foot) {
    console.log('verify');
    console.log(foot[FootSide.Left]);
    console.log(foot[FootSide.Right]);

    if (foot[FootSide.Left] !== null) {
      const footLeftPictures = Object.entries(foot[FootSide.Left].footPicture);
      for (const [view, picture] of footLeftPictures) {
        if (picture.blob !== undefined) {
          console.log('call upload');
          this.uploadFootPicture(view, 'images/', picture.blob, 'left');
        }
      }
    }

    // if (footRight !== null) {
    //   console.log('verift right');
    //   const footRightPictures = Object.entries(footRight);
    //   for (const [view, picture] of footRightPictures) {
    //     if (picture.blob !== undefined) {
    //       console.log('call upload');
    //       this.uploadFootPicture(view, 'images/', picture.blob, 'right');
    //     }
    //   }
    // }
  }

  // gravaFoto(idDoTeste: string, urlImagem: string): Promise<any> {
  //   const storageRef: AngularFireStorageReference = this.fireStorage.ref(
  //     `${this.idDoAtleta}/${idDoTeste}/imagemX/`
  //   );
  // }
  /**
   * 
   * @param athleteId 
   * @param assessId 
   * @param footPicture
   * 
   * https://firebase.google.com/docs/storage/web/upload-files?hl=pt-Br
   * https://firebase.google.com/docs/reference/js/firebase.storage.Storage#ref
   */
  // imageUrl: Observable<string>;
  uploadFootPicture(
    view: string,
    basePath: string,
    blob: Blob,
    footSide: string,
  ) {
    // return new Promise<string>((resolve, reject) => {
    console.log('upload ' + footSide + view);

    //   // const storagePath = `${this.userId}/${athleteId}/${assessId}/foot${footSide}/`;
    const storageRef: AngularFireStorageReference = this.fireStorage.ref(
      `${basePath}foot${footSide}/${Date.now()}_${view}.png`
    );

    // storageRef.put(blob).then((snapshot) => {
    //   console.log('Uploaded a blob or file!');
    //   console.log(snapshot);
    //   snapshot.ref.getDownloadURL().then((url) => console.log(url));
    // let isActive
    const task = storageRef.put(blob);
    // console.log('ho');
    // task.snapshotChanges().pipe(
    //   tap(snapshot => {
    //     // isActive = snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
    //     console.log(snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes);
    //   }),

    //   finalize( async() => {
    //     const url = await storageRef.getDownloadURL().toPromise();
    //     // TODO: update o URL no firestore
    //     // resolve (url);
    //   })
    // ).subscribe();
    // console.log('lest go');
    // }
    // });
  }


  // task.snapshotChanges().pipe(
  //   finalize(() => {
  //     // const imageUrl = await storageRef.getDownloadURL().toPromise();
  //     // resolve(imageUrl);
  //     finalize(() => {
  //       storageRef.getDownloadURL().subscribe(url=>{this.imageUrl = url});
  //   })
  //   }),






  // let snapshot: Observable<any>;

  // task.snapshotChanges().pipe(
  //   finalize( async() => {
  //     await storageRef.getDownloadURL().toPromise();
  //   })
  // )
  // await storageRef.put(blob);
  // return storageRef.getDownloadURL();

  // } catch (error) {
  //   throw error;
  // }

  // const footPictures = Object.entries(footPicture);

  // for (const [view, picture] of footPictures) {
  //   if (picture.blob !== undefined) {
  //     const storageRef: AngularFireStorageReference = this.fireStorage.ref(
  //       `${storagePath}${view}FootPicture.png`
  //     );



  //     console.log(view);
  //     console.log(picture.blob);
  //     console.log(picture.metadata);
  //     console.log('::::::::::::');
  //   }
  // }
}


