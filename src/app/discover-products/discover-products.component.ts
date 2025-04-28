import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-discover-products',
  templateUrl: './discover-products.component.html',
  styleUrls: ['./discover-products.component.css']
})
export class DiscoverProductsComponent implements OnInit {

  constructor() { }

  products = [
    {
      image: `https://picsum.photos/300/200?random=1`,
      title: 'Papaverine hydrochloride, USP/EP',
      description:
        'Committed to driving patient access to personalized and essential medication. Medisca is proud to offer papaverine hydrochloride, USP/EP, as part of our chemical portfolio supporting men’s health.'
    },
    {
      image: `https://picsum.photos/300/200?random=2`,
      title: 'Phentolamine mesylate, USP',
      description:
        'Medisca now offers USP-grade phentolamine mesylate, the latest addition to our chemical portfolio aimed at improving patient lives through pharmaceutical compounding.'
    }
  ];

  onLearnMore(title: string) {
    alert(`Learn more about: ${title}`);
  }
  ngOnInit(): void {
  }

}
