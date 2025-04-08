import { Injectable, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalSpinnerComponent } from '../modal-spinner/modal-spinner.component';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private modalRef: any;
  private data: any;
  private routerUrl: any;
  private routerName: any;
constructor(private modalService: NgbModal) {}
private modalSpinnerComponent!: ModalSpinnerComponent;
  acessflag:boolean=false;
  registerModal(modal: ModalSpinnerComponent) {
    this.modalSpinnerComponent = modal;
  }


  setData(data: any) {
    this.data = data;
    this.acessflag=true
  }

  getData() {
    if(this.acessflag)
    {
      this.acessflag=false
      return this.data;
    }
  }

setRouter(routerUrl: any,routerName: any) {
this.routerUrl=routerUrl;
this.routerName=routerName;
}

  getRouter() {
    return {
      routerUrl: this.routerUrl,
      routerName: this.routerName
      }
    }


    openModal() {
      this.modalSpinnerComponent.onOpenSpinner();
    }
  
    closeModal() {
      this.modalSpinnerComponent.onCloseSpinner();
      }
    
  
}
