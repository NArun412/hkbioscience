import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent implements OnInit {

  isLinear = true;
  
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  fourthFormGroup!: FormGroup;

  Business_Form!: FormGroup;
  countries = [
    { code: 'US', name: 'United States' },
    { code: 'IN', name: 'India' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' }
  ];
  

  cards = Array.from({ length: 10 }, (_, i) => ({
    title: `Card ${i + 1}`,
    description: 'This is a description for the card.',
    image: `https://picsum.photos/300/200?random=${i + 1}`
  }));

  selectedCardIndex: number | null = null;
  selectedCard: any = null;

  selectCard(card: any, index: number): void {
  this.selectedCard = card;
  this.selectedCardIndex = index;
  }

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {

    this.Business_Form = this._formBuilder.group({
      country: ['']
    });

    // this.firstFormGroup = this._formBuilder.group({
      // firstCtrl: ['', Validators.required],
    // });
    this.secondFormGroup = this._formBuilder.group({
      // secondCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      // thirdCtrl: ['', Validators.required],
    });
    this.fourthFormGroup = this._formBuilder.group({
      // fourthCtrl: ['', Validators.required],
    });
  }

  submit() {
    if (this.Business_Form.valid && this.secondFormGroup.valid && this.thirdFormGroup.valid && this.fourthFormGroup.valid) {
      // Handle form submission
      console.log('Form Submitted');
    }
  }
}
