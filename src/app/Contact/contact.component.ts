import { Component, OnInit } from '@angular/core';
import { ContactService } from './contact.service';
import Swal from 'sweetalert2';
import { BlogPostService } from '../services/blog-post.service';
import { BlogFetchModel } from 'src/Model/BlogFetchModel';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  blogPosts: BlogFetchModel[] = []; 
  constructor(private contactService: ContactService, private blogPostService: BlogPostService, private router: Router, private sharedService: SharedService) { }
  public panelone: boolean = true;
  public paneltwo: boolean = false;
  public panelthree: boolean = false;
  public panelfour: boolean = false;
  public name: string = '';
  public industry: string = '';
  public email: string = '';
  public Issubmitted: boolean = false;
  public cleanroomClass: string = '';
  public projectStartTime: string = '';
  public changepanel1sub: boolean = false;
  public changepanel2sub: boolean = false;
  public changepanel3sub: boolean = false;
  public changepanel4sub: boolean = false;
  public nameError: boolean = false;
  public emailError: boolean = false;
  public selectedOption: string = 'email';
  public textInput: string = '';
  public textError: boolean = false;
  selectedPanelClass: string | null = null;
  text: string = '';
  images : any  = [];

  
currentIndex: number = 0;
secondIndex:number=1

// Function to go to the next image
nextImage() {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * this.images.length);
  } while (randomIndex === this.currentIndex);

  this.currentIndex = randomIndex;
  this.secondIndex= this.currentIndex+1;
}

  ngOnInit(): void {
    this.blogPostService.getBlogPosts().subscribe(
        data => {
          this.blogPosts = data.slice(0, 3)
        },
        (error: HttpErrorResponse) => {
          // Handle error here if needed
        }
      );
      this.images = [
        {
          src: '../../assets/Images/CR1.png',       
        },
        {
          src: '../../assets/Images/CR2.png',       
        },
        {
          src: '../../assets/Images/CR3.png',       
        },{
          src: '../../assets/Images/CR4.png',       
        },{
          src: '../../assets/Images/CR5.png',       
        },{
          src: '../../assets/Images/CR6.png',       
        },{
          src: '../../assets/Images/CR7.png',       
        },{
          src: '../../assets/Images/CR8.png',       
        },{
          src: '../../assets/Images/CR9.png',       
        }
      ];
  }

  RedirectBlog(UploadID: number) {
    this.sharedService.setData({ id: UploadID }); // Set data
    this.router.navigate(['/HKBBlog']);
  }

  changepanel1() {
    this.changepanel1sub = true;
    this.validateName();
    if (this.name) {
      this.panelone = false;
      this.paneltwo = true;
      this.panelthree = false;
      this.panelfour = false;
    }
  }

  changepanel2() {
    this.changepanel2sub = true;
    this.validateIndustry();
    if (this.industry) {
      this.panelone = false;
      this.paneltwo = false;
      this.panelthree = true;
      this.panelfour = false;
    }
  }

  changepanel3() {
    this.changepanel3sub = true;
    if (this.cleanroomClass) {
      this.panelone = false;
      this.paneltwo = false;
      this.panelthree = false;
      this.panelfour = true;

      if (window.innerWidth <= 576) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailError = !emailPattern.test(this.email);
  }

  validateText() {
    const textPattern = /^[A-Za-z\s]*$/; 
    this.textError = !textPattern.test(this.textInput);
    this.textInput = this.textInput.replace(/[^A-Za-z\s]/g, '').slice(0, 50).trim(); 
  }
  

  validateTexts(textInput: HTMLInputElement) {
    const regex = /^[a-zA-Z]*$/;
    if (!regex.test(textInput.value)) {
      textInput.setCustomValidity('Please enter only letters.');
    } else {
      textInput.setCustomValidity('');
    }
    textInput.reportValidity();
  }
  validateName() {
    const regex = /^[A-Za-z\s]*$/; 
    this.nameError = !regex.test(this.name);
    this.name = this.name.replace(/[^A-Za-z\s]/g, '').slice(0, 50).trim();
  }

  validateIndustry() {
    const regex = /^[A-Za-z\s]*$/; 
    this.nameError = !regex.test(this.industry); 
    this.industry = this.industry.replace(/[^A-Za-z\s]/g, '').slice(0, 50).trim(); 
  }

  onOptionChange() {
    if (this.selectedOption === 'email') {
      this.emailError = false;
      this.textInput = '';
    } else if (this.selectedOption === 'text') {
      this.textError = false;
      this.email = '';
    }
  }

  previousPanel(): void {
    if (this.panelfour) {
      this.panelfour = false;
      this.panelthree = true;
    } else if (this.panelthree) {
      this.panelthree = false;
      this.paneltwo = true;
    } else if (this.paneltwo) {
      this.paneltwo = false;
      this.panelone = true;
    }
  }

  
  Submit() {
    this.changepanel4sub = true;
    this.validateEmail();
    this.validateText();
  
    if ((this.selectedOption === 'email' && this.emailError) ||
      (this.selectedOption === 'text' && this.textError)) {
      return; 
    }
 
    if ((this.selectedOption === 'email' && this.email && this.projectStartTime) ||
        (this.selectedOption === 'text' && this.textInput && this.projectStartTime)) {
      
      const plannerData = {
        name: this.name,
        industry: this.industry,
        cleanroomClass: this.cleanroomClass,
        email: this.selectedOption === 'email' ? this.email : this.textInput,
        projectStartTime: this.projectStartTime
      };
 
      this.contactService.submitPlannerData(plannerData).subscribe(
        response => {
          Swal.fire({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            icon: 'success',
            timer: 1000,
            title: 'Submitted Successfully',
          });
          this.Issubmitted = true;
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.sendEmail(plannerData);  
        },
        error => {
          Swal.fire({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            icon: 'error',
            timer: 1000,
            title: 'Submission failed',
          });
        }
      );
    } else {
      Swal.fire({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        icon: 'error',
        timer: 1000,
        title: 'Please provide all required information',
      });
    }
  }
  
  sendEmail(plannerData: any) {
    this.contactService.sentemail(plannerData).subscribe(
      (res: any) => {
        if (res.result) {
          Swal.fire({
            toast: true,
            position: "top",
            showConfirmButton: false,
            icon: 'success',
            timer: 3000,
            title: 'Email Sent Succesfully',
          });
        } else {
          let msg = res.str_Message;
          Swal.fire({
            toast: true,
            position: "top",
            showConfirmButton: false,
            icon: 'warning',
            timer: 3000,
            title: msg,
          });
        }
      },
      (_error: any) => {
        Swal.fire({
          toast: true,
          position: "top",
          showConfirmButton: false,
          icon: 'warning',
          timer: 3000,
          title: 'Something went wrong, Mail cannot be sent',
        });
      }
    );
  }
  

 
  toggleCardDesign(event: MouseEvent, className: string) {
    const element = event.currentTarget as HTMLElement;
    if (this.cleanroomClass === className) {
      this.cleanroomClass = '';
      element.classList.remove('panel-clicked');
      element.classList.add('disablepanel');
      return;
    }
    this.cleanroomClass = className;
    const panels = document.querySelectorAll('.panel1, .panel2, .panel3, .panel4, .panel5');
    const paneltext = document.querySelectorAll('.paneltext');
    panels.forEach(panel => {
      panel.classList.remove('panel-clicked');
      panel.classList.add('disablepanel');
    });
    paneltext.forEach(panel => panel.classList.add('disabletext'));
    element.classList.add('panel-clicked');
    element.classList.remove('disablepanel');
    
    const parent = element.closest('.col-lg-2');
    if (parent) {
      const associatedText = parent.querySelector('.paneltext');
      if (associatedText) {
        associatedText.classList.remove('disabletext');
      }
    }
  }
}  

document.addEventListener('DOMContentLoaded', () => {
  let span = '';
  const sectionCols = document.querySelectorAll('.section-5 .section-slide .section-col');

  for (let i = 0; i < sectionCols.length; i++) {
    const spanActive = (i === 0) ? 'active' : '';
    span += `<span class="${spanActive}"></span>`;
  }

  const sectionSlideThumb = document.querySelector('.section-slide-thumb') as HTMLElement;
  if (sectionSlideThumb) {
    sectionSlideThumb.innerHTML = span;
  }

  btnSlideNext();
});

function btnSlideNext(): void {
  const btnSlideNext = document.getElementById('btn-slide-next') as HTMLElement;

  if (btnSlideNext) {
    btnSlideNext.addEventListener('click', () => {
      const sectionSlide = document.querySelector('.section-5 .section-slide') as HTMLElement;
      const firstSectionCol = document.querySelector('.section-5 .section-slide .section-col') as HTMLElement;
      if (sectionSlide && firstSectionCol) {
        sectionSlide.appendChild(firstSectionCol.cloneNode(true));
        firstSectionCol.style.width = '0';

        setTimeout(() => {
          firstSectionCol.remove();
        }, 100);

        const activeChild = document.querySelector('.section-slide-thumb span.active') as HTMLElement;
        if (activeChild) {
          const index = Array.from(activeChild.parentNode!.children).indexOf(activeChild);
          const spans = document.querySelectorAll('.section-slide-thumb span');
          spans.forEach(span => span.classList.remove('active'));

          let newIndex = index + 1;
          if (newIndex >= sectionSlide.children.length - 1) {
            newIndex = 0;
          }

          const newActiveSpan = spans[newIndex] as HTMLElement;
          if (newActiveSpan) {
            newActiveSpan.classList.add('active');
          }
        }
      }
    });
  }
}
