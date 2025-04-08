import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-spinner',
  templateUrl: './modal-spinner.component.html',
  styleUrls: ['./modal-spinner.component.css']
})
export class ModalSpinnerComponent  {
  isVisible:boolean=false;

  onCloseSpinner() {
    setTimeout(() => {
      this.isVisible = false; // Hide the modal after delay
    }, 1000); // Delay of 1 second (1000 ms)
  }

  onOpenSpinner() {
    this.isVisible = true; // Show the modal
  }
  }

