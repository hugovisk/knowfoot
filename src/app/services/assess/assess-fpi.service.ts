import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { AssessFpi } from '../../models/interfaces/assess-fpi';
// import { FootSide } from '../../models/enums/foot.enum';


@Injectable({
  providedIn: 'root'
})
export class AssessFpiService {
  /** ID do usuário */
  private userId: string;

  // private assessPath: string;

  /** Caminho para a coleção de atletas no firestore */
  private assessOrderByNewestCollection: AngularFirestoreCollection<AssessFpi>;

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
  async createAssess(assess: AssessFpi): Promise<any> {
    try {
      let assessCollection: AngularFirestoreCollection<AssessFpi>;
      const assessPath = `/userProfile/${this.userId}/athletes/${assess.athleteId}/assess/`;
      const footPicture: { [footView: string]: { blob?: Blob, metadata?: Object } } = {};

      /**
       * se houver fotos as extrai para o objeto local `footPicture` e deleta o atributo
       * no objeto do assess. Isto porque os arquivos de foto serão enviados para o storage
       * depois da criação da avaliação no firestore e não é aceito esse tipo de arquivos
       * no firestore.
       */
      Object.keys(assess.foot).forEach(side => {
        if ('footPicture' in assess.foot[side]) {
          footPicture[side] = assess.foot[side].footPicture;
        }
        delete assess.foot[side].footPicture;
      });

      assessCollection = this.firestore.collection<AssessFpi>(assessPath);

      assess.assessId = await this.firestore.createId();
      assess.createdAt = await firebase.firestore.FieldValue.serverTimestamp();
      assess.updatedAt = assess.createdAt;
      assess.isDeleted = false;

      await assessCollection.doc(assess.assessId).set(assess);

      // envio dos arquivos de imagem para o fireStorage
      Object.keys(footPicture).forEach(side => {
        Object.entries(footPicture[side]).forEach(([view, picture]) => {
          if (picture['blob']) {
            const storagePath = `${this.userId}/${assess.athleteId}/${assess.assessId}/foot${side}/`;
            const storeDownloadUrl = `foot.${side}.imageUrl.${view}.downloadUrl`;
            const storePathUrl = `foot.${side}.imageUrl.${view}.path`;

            this.uploadPicture(view, picture['blob'], storagePath, assessCollection, assess.assessId, storeDownloadUrl, storePathUrl);
          }
        });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * 
   * @param view vista do pé
   * @param blob arquivo de imagem
   * @param basePath caminho base para o firestorage
   * @param collection referencia da coleção no cloud firestore
   * @param assessId id da avaliação para update no avaliação
   * @param storeDownloadUrl referencia do atributo downloadUrl
   * @param storePathUrl referencia do atributo path
   * 
   * https://firebase.google.com/docs/storage/web/upload-files?hl=pt-Br
   * https://firebase.google.com/docs/reference/js/firebase.storage.Storage#ref 
   */
  uploadPicture(
    view: string,
    blob: Blob,
    basePath: string,
    collection: AngularFirestoreCollection<AssessFpi>,
    assessId: string,
    storeDownloadUrl: string,
    storePathUrl: string
    // metadata: Object, // TODO avaliar se eh necessario enviar metadata
  ) {
    const path = `${basePath}/${Date.now()}_${view}.png`;
    const storageRef: AngularFireStorageReference = this.fireStorage.ref(path);
    const task = storageRef.put(blob);
    task.snapshotChanges().pipe(
      // tap(snapshot => {
      //   // isActive = snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
      //   console.log(snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes);
      // }),

      finalize(async () => {
        const downloadUrl = await storageRef.getDownloadURL().toPromise();
        collection.doc(assessId).update({
          [storeDownloadUrl]: downloadUrl,
          [storePathUrl]: path
        });
      })
    ).subscribe();
  }

  /**
 * 
 * @param athleteId chave do atleta
 * @param assessId chava da avaliação que deixará de ser listada
 * 
 */
  async removeAssess(athleteId: string, assessId: string): Promise<any> {
    try {
      const assessPath = this.getAssessPath(athleteId);
      const assessCollection = this.firestore.collection<AssessFpi>(assessPath);

      return await assessCollection.doc(assessId).update({ isDeleted: true });
    } catch (error) {
      throw error;
    }
  }

  getAssessOrderByNewest(athleteId: string): Observable<any> {
    const assessPath = this.getAssessPath(athleteId);
    this.assessOrderByNewestCollection =
      this.firestore.collection<AssessFpi>(assessPath, ref =>
        // necessario criar index no firestore para esta query
        ref.where('isDeleted', '==' , false).orderBy('createdAt', 'desc')
      );

      return this.assessOrderByNewestCollection.valueChanges();
  }

  getAssessList(athleteId: string): Observable<any> {
    const assessPath = this.getAssessPath(athleteId);
    const assessCollection =
      this.firestore.collection<AssessFpi>(assessPath);

      return assessCollection.valueChanges();
  }

  getAssessPath(athleteId: string): string {
    return `/userProfile/${this.userId}/athletes/${athleteId}/assess/`;
  }
}


