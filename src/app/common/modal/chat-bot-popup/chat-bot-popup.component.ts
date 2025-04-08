import { Component,OnInit,AfterViewInit, ElementRef, EventEmitter, Output, ViewChild, HostListener, AfterViewChecked } from '@angular/core';
import { DatePipe } from '@angular/common';
import {ChatModel} from '../../../../Model/ChatModel'
import {Chatlog} from '../../../../Model/Chatlog'
import {ChatService} from '../../../services/chat.service'
import {SharedService} from '../../../services/shared.service'
import {SessionTimeoutService} from '../../../services/session-timeout.service'
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormGroup,FormControl, Validators, FormBuilder  } from '@angular/forms';
import { DATE } from 'ngx-bootstrap/chronos/units/constants';
@Component({
  selector: 'app-chat-bot-popup',
  templateUrl: './chat-bot-popup.component.html',
  styleUrls: ['./chat-bot-popup.component.css'],
  providers: [DatePipe]
})
export class ChatBotPopupComponent  implements OnInit,AfterViewInit {
  isUserLoggedIn:boolean=false;
  chatmodel: ChatModel[] = [];
  chatlog: Chatlog[] = [];
  messages: Message[] = []; // Store messages
  TodayDate: any;
  email: string = '';
  emailfalg: boolean = false;
  sendmessages: string = '';
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @Output() closeModal = new EventEmitter<void>();
  isVisible = false; // Control modal visibility
  emailForm: FormGroup;

  constructor(private chatService:ChatService,private sharedService :SharedService,
    private sessionTimeoutService :SessionTimeoutService,private fb: FormBuilder
  ) {
    // this.sessionTimeoutService.timeoutWarning$.subscribe(showWarning => {
    //   if (showWarning) {
    //     alert('Your session is about to expire!'); // Show a modal or alert
    //   }
    // });
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]]
    });

   }


  ngAfterViewInit() {
   this.scrollToBottom();
   }

  private scrollToBottom(): void {
    try {
       this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  


  ngOnInit(): void {
    // Initial message from the bot
    this.isUserLoggedIn=localStorage.getItem('isUserLoggedIn') === 'true' ? true : false;
    this.TodayDate=new Date();
    this.InitialLoad();
    this.chatService.getBotData().subscribe(
      data => {
        this.chatmodel = data;      
        this.scrollToBottom();    
      },
      (error: HttpErrorResponse) => {
        // Handle error here if needed
      }); 
  }
  InitialLoad()
  {
    this.messages.push({
      content: 'Welcome to HK Bioscience! How can I assist you today?',
      Fromuser: false,
      ID: 1,
      Isfirst: true
    });

  }

  // Send email function
  emailsend() {
    // Logic for sending email
    // You can update the message array to show the sent email
    this.messages.push({
      content: `Email sent: ${this.email}`,
      Fromuser: true,
      status: 'Sent',
      time:new Date()
    });

    this.messages.push({
      content: 'Hello',
      Fromuser: false,
      Isfirst: true,
      status: 'Received',
      time:new Date()
    });

    this.chatlog.push({
      logDatetime:  new Date(),
      emailId:this.email,
      request:'Email-Submitted',
      intentId: 0,
      isNomatch: false
    });
 // Clear the input
    this.emailfalg=true


    this.chatService.updateChatlog(this.chatlog).subscribe(
      (response) => {this.chatlog =[];},
      (error: HttpErrorResponse) => {}
    );

    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
  }

  // Send message function
  sendmsg() {
    if (this.sendmessages.trim()) {
      // Push user's message to messages array
      this.messages.push({
        content: this.sendmessages,
        Fromuser: true,
        status: 'Sent',
        time:new Date()
      }); 

     const response= this.chatService.getdata(this.sendmessages,this.chatmodel)

     this.chatlog.push({
      logDatetime:  new Date(),
      emailId:this.email,
      request:this.sendmessages,
      intentId: response.IntentId,
      isNomatch: response.ISnomatches
    });

     this.chatService.updateChatlog(this.chatlog).subscribe(
       (response) => { this.chatlog =[]; },
       (error: HttpErrorResponse) => {}
      );

      this.sendmessages = '';
      // Simulate a bot response 
      setTimeout(() => {
      this.messages.push({
        content: response.Responses,
        Fromuser: false,
        status: 'Received',
        time:new Date()
      });
      }, 200); // Simulating a delay for bot response
       this.scrollToBottom();

       setTimeout(() => {
        this.scrollToBottom();
      }, 500);
     this.resetTextareaHeight();
    }
  }
  Endchat() {
    Swal.fire({
      title: "Do you want to end the chat?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
      customClass: {
      title: 'swal-title' // Apply a custom class to the title
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => {
          this.messages.push({
            content: 'Thank You!',
            Fromuser: false,
            status: 'Received'
          });
        }, 500); 
    
        setTimeout(() => {this.emailfalg= false;
        this.messages=[];
        this.sendmessages='';
        this.chatlog =[];
        this.InitialLoad();
        this.onClose();
      }, 1000); 

      } else if (result.isDenied) {
      }
    });  
  }


  onClose() {
    this.isVisible = false; // Hide the modal
  }

  openModal() {
    this.isVisible = true; // Show the modal
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
  }

  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset height to auto to calculate new height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set new height based on scroll height
  }

  resetTextareaHeight(): void {
    const textarea = document.getElementById('messageTextarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.value = ''; // Clear the textarea content
      textarea.style.height = 'auto'; // Reset height to default
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        // Shift + Enter should allow new line
        return;
      } else {
        // Enter without Shift triggers the send button
        event.preventDefault();  // Prevents the default action of inserting a new line
        this.sendmsg();
      }
    }
  }
  reloadComponent() {
    this.isUserLoggedIn=localStorage.getItem('isUserLoggedIn') === 'true' ? true : false;
  }
}

interface Message {
  content: string;
  Fromuser: boolean; // true if from user, false if from bot
  ID?: number;
  Isfirst?: boolean;
  status?: string;
  time?:Date
}