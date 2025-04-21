import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-business-form',
  templateUrl: './business-form.component.html',
  styleUrls: ['./business-form.component.css']
})
export class BusinessFormComponent implements OnInit {

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
    this.Business_Form.patchValue({ selectedCard: card });
  }
  
  // selectCard(card: any, index: number): void {
  // this.selectedCard = card;
  // this.selectedCardIndex = index;
  // }

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.Business_Form = this.fb.group({
      country: ['', Validators.required],
      selectedCard: [null, Validators.required]  // ← Add this
    });
  }

  onNext(): void {
    if (this.Business_Form.valid) {
      // Replace with router navigation if needed
      console.log('Form Data:', this.Business_Form.value);
      // Example navigation:
      this.router.navigate(['/CreateAccountForm']);
    } else {
      this.Business_Form.markAllAsTouched();
    }
  }
  

  // ngOnInit(): void {
  //   this.Business_Form = this.fb.group({
  //     country: ['']
  //   });
  // }

}
