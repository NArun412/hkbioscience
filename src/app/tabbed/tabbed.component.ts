import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tabbed',
  templateUrl: './tabbed.component.html',
  styleUrls: ['./tabbed.component.css']
})
export class TabbedComponent implements OnInit {

  Business_Form!: FormGroup;
  selectedCardIndex: number | null = null;
  selectedTabIndex: number = 0;

  countries = [
    { code: 'US', name: 'United States' },
    { code: 'IN', name: 'India' },
    { code: 'UK', name: 'United Kingdom' }
  ];

  cards = [
    {
      title: 'Retail',
      description: 'Sell products to customers.',
      image: 'assets/retail.png'
    },
    {
      title: 'Service',
      description: 'Offer services to clients.',
      image: 'assets/service.png'
    },
    {
      title: 'Manufacturing',
      description: 'Produce goods and materials.',
      image: 'assets/manufacturing.png'
    }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.Business_Form = this.fb.group({
      country: ['', Validators.required],
      businessType: ['', Validators.required]
    });
  }

  selectCard(card: any, index: number): void {
    this.selectedCardIndex = index;
    this.Business_Form.patchValue({ businessType: card.title });
  }
}
