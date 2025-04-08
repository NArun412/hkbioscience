import { Component, HostListener, OnInit } from '@angular/core';
import { BlogPostService } from '../services/blog-post.service';
import { SharedService } from '../services/shared.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BlogFetchModel } from 'src/Model/BlogFetchModel';
import { Category } from 'src/Model/Category';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
blogPosts: BlogFetchModel[] = []; 
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

  constructor(private blogPostService: BlogPostService,private router: Router,private sharedService: SharedService) { }
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

    RedirectProduct(product: string) {
      this.sharedService.setData({ name: product }); // Set data
       this.router.navigate(['/Product']);
      }

}



// document.addEventListener('DOMContentLoaded', () => {
//   const nextButton = document.getElementById('btn-slide-next') as HTMLElement;
//   const slide = document.querySelector('.section-slide') as HTMLElement;
//   const thumbs = document.querySelectorAll('.section-slide-thumb .thumb') as NodeListOf<HTMLElement>;
//   let currentIndex = 0;

//   const updateThumbs = (index: number) => {
//     thumbs.forEach((thumb, i) => {
//       if (i === index) {
//         thumb.classList.add('active-thumb');
//       } else {
//         thumb.classList.remove('active-thumb');
//       }
//     });
//   };

//   nextButton.addEventListener('click', () => {
//     const slides = document.querySelectorAll('.section-col') as NodeListOf<HTMLElement>;
//     currentIndex = (currentIndex + 1) % slides.length;
//     slide.style.transform = `translateX(-${currentIndex * 100}%)`;

//     // Adjust image sizes
//     slides.forEach((slide, index) => {
//       const img = slide.querySelector('img') as HTMLImageElement;
//       if (index === currentIndex) {
//         img.classList.add('large-img');
//       }
//       // else {
//       //   img.classList.remove('large-img');
//       // }
//     });

//     // Update thumbnails
//     updateThumbs(currentIndex);
//   });

//   // Initialize thumbnails
//   updateThumbs(currentIndex);
// });



// document.addEventListener('DOMContentLoaded', () => {
//   const nextButton = document.getElementById('btn-slide-next') as HTMLElement;
//   const slide = document.querySelector('.section-slide') as HTMLElement;
//   let currentIndex = 0;

//   nextButton.addEventListener('click', () => {
//     const slides = document.querySelectorAll('.section-col') as NodeListOf<HTMLElement>;
//     if (currentIndex < slides.length - 1) {
//       currentIndex++;
//     } else {
//       currentIndex = 0;
//     }
//     slide.style.transform = `translateX(-${currentIndex * 100}%)`;

//     // Adjust image sizes
//     slides.forEach((slide, index) => {
//       const img = slide.querySelector('img') as HTMLImageElement;
//       if (index === currentIndex) {
//         img.classList.add('large-img');
//       } else {
//         img.classList.remove('large-img');
//       }
//     });
//   });
// });


// // dashboard.component.ts
// import { Component, OnInit } from '@angular/core';
// import * as $ from 'jquery';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })
// export class DashboardComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//     this.initializeScripts();
//   }

//   initializeScripts(): void {
//     (function($) {
//       $(document).ready(function(){
//         $('.menu-btn,.menu-back').click(function(){
//           if($('.menu-back').hasClass('active')) {
//             $('.menu-back').removeClass('active');
//             $('.menu-items').removeClass('active');
//           } else {
//             $('.menu-back').addClass('active');
//             $('.menu-items').addClass('active');
//           }
//         });
//         let span = '';
//         for(let i = 0; i < $('.section-5 .section-slide .section-col').length; i++) {
//           let span_active = (i === 0) ? 'active' : '';
//           span += `<span class="${span_active}"></span>`;
//         }
//         $('.section-slide-thumb').html(span);
//         this.btn_slide_next();
//       }.bind(this));
//     })(jQuery);
//   }

//   btn_slide_next(): void {
//     (function($) {
//       $('#btn-slide-next').click(function() {
//         $('.section-5 .section-slide').eq(0).append($('.section-5 .section-slide .section-col').eq(0).clone());
//         $('.section-5 .section-slide .section-col').eq(0).css({'width':'0'});
//         setTimeout(function(){
//           $('.section-5 .section-slide .section-col').eq(0).remove();
//         },100);
//         let activeChild = $('.section-slide-thumb span.active');
//         let index = activeChild.index();
//         $('.section-slide-thumb span').removeClass('active');
//         let new_index = index + 1;
//         if(new_index === $('.section-5 .section-slide .section-col').length - 1) {
//           new_index = 0;
//         }
//         $('.section-slide-thumb span').eq(new_index).addClass('active');
//       });
//     })(jQuery);
//   }
// }
