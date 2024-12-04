import { Component, ViewChild, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ScoreService } from '../score.service'; 
import Swal from 'sweetalert2';  // Assurez-vous d'importer SweetAlert2

@Component({
  selector: 'app-europe',
  templateUrl: './europe.component.html',
  styleUrls: ['./europe.component.css']
})
export class EuropeComponent implements AfterViewInit {
  @ViewChild('mySelect1') mySelect1!: ElementRef<HTMLSelectElement>;
  @ViewChild('mySelect2') mySelect2!: ElementRef<HTMLSelectElement>;

  t1: string[] = ['Portugal', 'Spain', 'France', 
    'Italy', 'Switzerland', 'Germany', 'Poland', 'Belarus',
    'Russia', 'Ukraine', 'Moldavia', 'Romania',
    'Bulgaria', 'Macedonia', 'Greece'];

  score = 0;

  constructor(private cdRef: ChangeDetectorRef, private scoreService: ScoreService) {}

  ngAfterViewInit() {
    this.score = this.scoreService.getScore('europe');
    this.disableSavedOptions();
  }

  private disableSavedOptions() {
    const disabledOptions = this.scoreService.getDisabledOptions('europe');
    const numeroOptions = this.mySelect2.nativeElement.options;
    const paysOptions = this.mySelect1.nativeElement.options;

    Array.from(numeroOptions).forEach((option: HTMLOptionElement) => {
      if (disabledOptions.numbers.has(parseInt(option.value, 10))) {
        option.disabled = true;
      }
    });

    Array.from(paysOptions).forEach((option: HTMLOptionElement) => {
      if (disabledOptions.countries.has(option.value)) {
        option.disabled = true;
      }
    });
  }

  valide() {
    const valeurPays = this.mySelect1.nativeElement.value;
    const valeurNum = this.mySelect2.nativeElement.value;
    this.mySelect1.nativeElement.classList.remove('correct-selection', 'incorrect-selection');
    this.mySelect2.nativeElement.classList.remove('correct-selection', 'incorrect-selection');

    let isValid = false;
    if (valeurPays === "Sélectionnez un pays" || valeurNum === "Sélection numéro") {
      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez sélectionner un numéro et un pays.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    } else {
      const valeurNumm = parseInt(valeurNum, 10);
      for (let i = 0; i < this.t1.length; i++) {
        if (valeurPays === this.t1[i] && valeurNumm === i + 1) {
          this.scoreService.incrementScore('europe', 1);
          this.score = this.scoreService.getScore('europe');
          isValid = true;

          this.scoreService.addDisabledOption('europe', valeurPays, valeurNumm);
          break; // Sortie de la boucle
        }
      }

      if (isValid) {
        this.mySelect1.nativeElement.classList.add('correct-selection');
        this.mySelect2.nativeElement.classList.add('correct-selection');

        const numeroOptions = this.mySelect2.nativeElement.options;
        numeroOptions[valeurNumm].disabled = true;

        const paysOptions = this.mySelect1.nativeElement.options;
        for (let i = 0; i < paysOptions.length; i++) {
          if (paysOptions[i].value === valeurPays) {
            paysOptions[i].disabled = true;
            break;
          }
        }
      } else {
        this.mySelect1.nativeElement.classList.add('incorrect-selection');
        this.mySelect2.nativeElement.classList.add('incorrect-selection');
      }

      this.cdRef.detectChanges();
    }
  }
}
