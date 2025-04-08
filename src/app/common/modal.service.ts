import { Injectable, ComponentRef, Injector, ApplicationRef, ComponentFactoryResolver, TemplateRef } from '@angular/core';
import { ChatBotPopupComponent } from '../common/modal/chat-bot-popup/chat-bot-popup.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalComponent!: ChatBotPopupComponent;

  registerModal(modal: ChatBotPopupComponent) {
    this.modalComponent = modal;
  }

  openModal() {
    this.modalComponent.openModal();
  }

  closeModal() {
    this.modalComponent.onClose();
  }
}
