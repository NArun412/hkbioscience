import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';

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
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.Business_Form = this.fb.group({
      country: ['']
    });
  }

}
