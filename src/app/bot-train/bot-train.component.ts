import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { TrainbotGet } from '../../Model/TrainbotGet';
import {ChatService} from '../services/chat.service'
import {SharedService} from '../services/shared.service'
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bot-train',
  templateUrl: './bot-train.component.html',
  styleUrls: ['./bot-train.component.css']
})
export class BotTrainComponent implements OnInit {
hideDropdown() {
throw new Error('Method not implemented.');
}
onSearch() {
throw new Error('Method not implemented.');
}
 isUserLoggedIn:boolean=false;
 UpdatedId:number=0
  pageSize: number = 10; // Records per page
  currentPage: number = 1;
  totalPages: number = 0;
  intentsA:TrainbotGet[]=[];
  intents:any;
  displayeintents:any;
  selectedval:string|null="";
  title: string="";
  keywordtitle: string="";
  isExistalert: string|null="";
  Isinsert:boolean=false
  textresponse:string="";
  textkeyword:string="";
  textintent:string="";
  isExistalertRes="";
  isExistalertKey="";
  isExistalertInt="";

  constructor(private chatService :ChatService,private sharedService :SharedService) { }

  ngOnInit() {
    this.isUserLoggedIn=localStorage.getItem('isUserLoggedIn') === 'true' ? true : false;
    this.sharedService.openModal();
    this.chatService.getTraindata().subscribe(
      data => {
       this.intentsA = data;
       this.sharedService.closeModal();
       this.intents = this.intentsA.map(item => ({
        intentId: item.intentId,
        intentName: item.intentName,
        iskeydelete: item.keywords.length>1?true:false,
        isresponsedelete: item.responses.length>1?true:false,
        keywordsAndResponses: item.keywords.map((keywordItem, index) => ({
          keywordsId: keywordItem.keywordsId,   // Use the `keywordsId` from `Keyword` object
          keyword: keywordItem.keywords,
                 // Use the `keywords` string from `Keyword` object
          responsesId: item.responses[index]?.responsesId, // Use `responsesId` from the `Response` object
          response: item.responses[index]?.responses      // Use `responses` from the `Response` object
        }))
      }));
      this.updatePagination();
      this.totalPages = Math.ceil(this.intents.length / this.pageSize);
      },
      (error: HttpErrorResponse) => {
        // Handle error here if needed
        this.sharedService.closeModal();
      }

    );  
   
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayeintents = this.intents.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth' // Smooth scrolling
        });
      }, 50);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth' // Smooth scrolling
        });
      }, 50);
    }
  }

  deletevent(value: any,id: any,title: string) {

    Swal.fire({
      title: "Do you want to delete the "+title+"?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
      customClass: {
      title: 'swal-title' // Apply a custom class to the title
      }
    }).then((result) => {
      if (result.isConfirmed) {
    this.chatService.deleteEvent(value,id,title).subscribe(
      (response) => {
        this.ShowInfoAlert(this.title+' Delete Successfully');
        this.reloadfun();
      
      },
      (error: HttpErrorResponse) => {}
    );
  }
    else if (result.isDenied) {
    }
  });
    }

  openModal(valselected: any,id:number,title:string, Isinsert?:boolean) {
      this.isExistalert=''
      this.keywordtitle=title;
      this.Isinsert=Isinsert?Isinsert:false;
      this.UpdatedId =id;
      const element = document.getElementById('editModal');
      const elementtext = document.getElementById('editModaltext');
      if(valselected =='')
      {
        this.title='Add New '+title
      }else{ this.title='Update '+title }
      
      const val= valselected;
      if(title=='Intent'||title=='Keyword')
      {
        if (elementtext) {
          const modal = new bootstrap.Modal(elementtext as HTMLElement);
          modal.show();
         }
      }
      else
      {
        if (element) {
          const modal = new bootstrap.Modal(element as HTMLElement);
          modal.show();
         }
      }
    
        this.selectedval= val
  }
      
  adjustTextareaHeight($event: Event) {
        const textarea = event?.target as HTMLTextAreaElement;
        if (textarea) {
          textarea.style.height = 'auto'; // Reset height to auto to calculate new height
          textarea.style.height = `${textarea.scrollHeight}px`;
        }
       
  }
 
  saveChanges() {
      if(this.selectedval==""||this.selectedval==null)
      {
         this.isExistalert = 'Please enter '+this.title+'.';
         return
      }
      if(this.keywordtitle=='Intent')
        {
          let isExist: boolean = this.intentsA.find(x => x.intentName.toLowerCase().trim() === this.selectedval?.toLowerCase().trim()) !== undefined;
          if(isExist)
          {
            this.isExistalert = 'The Intent is already exists or needs modifications.'
            return
          }
        }
        else if(this.keywordtitle=='Keyword')
        {
          let isKeywordExist: boolean = this.intentsA.some(intent => 
            intent.keywords.some(keyword => 
              keyword.keywords.toLowerCase().trim() === this.selectedval?.toLowerCase().trim()
            )
          );
          if(isKeywordExist)
          {
            this.isExistalert = 'The Keyword is already exists or needs modifications.'
            return
          }
        }
        this.chatService.UpdateBot(this.UpdatedId,this.selectedval,this.keywordtitle,this.Isinsert).subscribe(
          (response) => {
            this.ShowInfoAlert(this.title+' Updated Successfully');
            this.reloadfun();
            const element = document.getElementById('editModal');
            const elementtext = document.getElementById('editModaltext');

            setTimeout(() => {  if(this.keywordtitle=='Intent'||this.keywordtitle=='Keyword')
              {
                if (elementtext) {
                  const modal = bootstrap.Modal.getInstance(elementtext); 
                  // const modal = new bootstrap.Modal(elementtext as HTMLElement);
                  modal?.hide();
                 }
              }
              else
              {
                if (element) {
                  const modal = bootstrap.Modal.getInstance(element); 
                  // const modal = new bootstrap.Modal(elementtext as HTMLElement);
                  modal?.hide();
                 }
              }
            },50)
          },
          (error: HttpErrorResponse) => {}
        );
 
   
  }

  ShowInfoAlert(response: any) {
        Swal.fire({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          icon: 'info',
          timer: 1500,
          title: response,
        })
  }
  
  reloadfun() {
    this.chatService.getTraindata().subscribe(
      data => {
       this.intentsA = data;
       this.sharedService.closeModal();
       this.intents = this.intentsA.map(item => ({
        intentId: item.intentId,
        intentName: item.intentName,
        iskeydelete: item.keywords.length>1?true:false,
        isresponsedelete: item.responses.length>1?true:false,
        keywordsAndResponses: item.keywords.map((keywordItem, index) => ({
          keywordsId: keywordItem.keywordsId,   // Use the `keywordsId` from `Keyword` object
          keyword: keywordItem.keywords,        // Use the `keywords` string from `Keyword` object
          responsesId: item.responses[index]?.responsesId, // Use `responsesId` from the `Response` object
          response: item.responses[index]?.responses      // Use `responses` from the `Response` object
        }))
      }));
      this.updatePagination();
      this.totalPages = Math.ceil(this.intents.length / this.pageSize);
      },
      (error: HttpErrorResponse) => {
        // Handle error here if needed
        this.sharedService.closeModal();
      }

    );  
  }

 
    AddIntent() {    
      const element = document.getElementById('AddModal');
      if (element) {
        const modal = new bootstrap.Modal(element as HTMLElement);
        this.textintent="";
        this.textkeyword="";
        this.textresponse="";
        modal.show();
       }     
    }

    Checkint() {
      if(this.textintent !="")
      {
          let isExist: boolean = this.intentsA.find(x => x.intentName.toLowerCase().trim() === this.textintent?.toLowerCase().trim() ) !== undefined;
          if(isExist)
          {
            this.isExistalertInt = 'The Intent '+this.textintent+' is already exists.'
            this.textintent="";
            return
          }
          else
          {
            this.isExistalertInt ="";
          }
       }
    }
    CheckKey() {
      let isKeywordExist: boolean=false;
      if(this.textkeyword !="")
      {
        if(this.textkeyword.includes('^'))
        {
          var Keywordfirst ='';
          let keywordlist: string[] = this.textkeyword.split('^');
          keywordlist.forEach(element => {
            isKeywordExist= this.intentsA.some(intent => 
              intent.keywords.some(keyword => 
                keyword.keywords.toLowerCase().trim() === element?.toLowerCase().trim()
              )
            ); 
            if(isKeywordExist) 
            {
              this.isExistalertKey = 'The Keyword '+element+' is already exists.'
              return
            }
            else
            {
              this.isExistalertKey='';
            }
          });
        }
        else
        {
          isKeywordExist= this.intentsA.some(intent => 
            intent.keywords.some(keyword => 
              keyword.keywords.toLowerCase().trim() === this.textkeyword?.toLowerCase().trim()
            )
          );

          if(isKeywordExist)
            {
              this.isExistalertKey = 'The Keyword '+this.textkeyword+' is already exists.'
              return
            }
            else
            {
              this.isExistalertKey='';
            }
        }

      }
     
  
  }

    saveIntentChanges() {
      if(this.textintent==""||this.textintent==null)
        {
           this.isExistalertInt = 'Please enter Intent.';
           return
        }
        else if(this.textkeyword==""||this.textkeyword==null)
        {
          this.isExistalertKey = 'Please enter Keyword.';
          return
        }
        else if(this.textresponse==""||this.textresponse==null)
        {
            this.isExistalertRes = 'Please enter Response.';
            return
        }
  
        this.chatService.AddIntentBot(this.textintent.toLowerCase().trim(),this.textkeyword.toLowerCase().trim(),this.textresponse.trim()).subscribe(
          (response) => {
            this.ShowInfoAlert(this.title+'Added Successfully');
            this.reloadfun();
            setTimeout(() => {  
              this.textintent="";
              this.textkeyword="";
              this.textresponse="";
            const element = document.getElementById('AddModal');
                if (element) {
                  const modal = bootstrap.Modal.getInstance(element); 
                  modal?.hide();
                 }},50)
          },
          (error: HttpErrorResponse) => {}
        );
    }
     
}
