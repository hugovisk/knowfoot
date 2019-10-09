import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatInput } from '@angular/material';

interface MedicalRecord {
  name: string;
  id?: string;
}


@Component({
  selector: 'app-medical-record-search-modal',
  templateUrl: './medical-record-search-modal.component.html',
  styleUrls: ['./medical-record-search-modal.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('0.2s ease-out',
              style({ height: 30, opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: 30, opacity: 1 }),
            animate('0.1s ease-in',
              style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})

export class MedicalRecordSearchModalComponent implements OnInit {
  searchControl: FormControl;
  // filteredStates: Observable<State[]>;

  testPacients: MedicalRecord[];
  searchedPatients: MedicalRecord[];

  searching = false;

  @ViewChild('searchInput', { static: false }) searchInput: MatInput;

  constructor(public modalController: ModalController) {
    this.searchControl = new FormControl('');

    this.testPacients = [
      {
        name: 'Emelia Joynes',
        id: 'weDHji0986yH'
      },
      { name: 'Marine Goldsborough' },
      { name: 'Jolanda Benigno' },
      { name: 'Nakisha Sibley' },
      { name: 'Treasa Tuma' },
      { name: 'Alesha Aslett' },
      { name: 'Von Leach' },
      { name: 'Abdul Dabbs' },
      { name: 'Demetria Schaffer' },
      { name: 'Oliver Erler' },
      { name: 'Dylan Sokolowski' },
      { name: 'Twyla Walrath' },
      { name: 'Katy Mcnutt' },
      { name: 'Alissa Tully' },
      { name: 'Devon Tse' },
      { name: 'Lisa Bosak' },
      { name: 'Paulette Snelson' },
      { name: 'Joni Farnum' },
      { name: 'Lita Friedlander' },
      { name: 'Javier Mook' }
    ];
  }

  ngOnInit() {
    this.setSearchedPatients('');

    this.searchControl.valueChanges
      .subscribe(() => {
        this.searching = true;
      });

    this.searchControl.valueChanges
      .pipe(debounceTime(700))
      .subscribe(search => {
        console.log('Pesquisa: ' + search);
        this.searching = false;
        this.setSearchedPatients(search);
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchInput.focus();
    }, 100);
  }

  /**
   * Recebe o nome do paciente a ser pesquisado e retorna
   * somente os que satisfação esse criterio
   * @param searchPatient
   */
  private filter(searchPatient: string) {
    return this.testPacients.filter(patient => {
      return patient.name.toLowerCase().indexOf(searchPatient.toLowerCase()) > -1;
    });
  }

  setSearchedPatients(search: string) {
    this.searchedPatients = this.filter(search);
  }

  async closeModalAndRetrievePatient(selectedPatient: MedicalRecord) {
    await this.modalController.dismiss({
      patient: selectedPatient
    });
  }

  async closeModal() {
    await this.modalController.dismiss();
  }
}
