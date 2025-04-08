import { Component,AfterViewInit, ViewChild, ElementRef, OnInit,TemplateRef } from '@angular/core';
declare var $: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../Model/Category';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ProductFetch } from '../../Model/ProductFetch';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedService } from '../../../src/app/services/shared.service';
import { ProductService } from '../services/product.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements AfterViewInit {
  @ViewChild('targetElement') targetElement!: ElementRef;
  @ViewChild('postargetElement') postargetElement!: ElementRef;
  fileInfo: { name: any; size: number; type: string } | null = null;
   productForm: FormGroup;
   categories: Category[] = [];
   selectedCategory: any = { id: null };
   selectedDate: any;
   description: string = '';
   subtitle: string = '';
   productname: string = '';
   selectedFile: File | null = null;
   imagePreview: string | ArrayBuffer | null = null;
   minDate: Date = new Date();
   dateError = false;
   @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
   isDateValid: boolean = true;
   isEffDateValid: boolean = true;
   debounceTimer: any;
   isUserLoggedIn: boolean = false;
 // Date pattern for validating DD/MM/YYYY format
   private datePattern: RegExp = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
   productPosts: ProductFetch[] = [];  // Store all posts here
   paginatedPosts: ProductFetch[] = [];  // Posts for current page
   currentPage = 1;
   postsPerPage = 10;
   totalPages = 0;
   Isedit : boolean= false;
   UploadID: any;
   @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
 
   // Function to format the date to DD/MM/YYYY format
   formatDateToDDMMYYYY(date: any): string {
     const d = new Date(date);
     const day = String(d.getDate()).padStart(2, '0');
     const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
     const year = d.getFullYear();
 
     return `${day}/${month}/${year}`;
   }
 
   constructor(private fb: FormBuilder,private http:
      HttpClient,private router: Router,private sharedService: SharedService,private productService :ProductService,
      private sanitizer: DomSanitizer) {
     this.productForm = this.fb.group({
       image: [null, Validators.required],
       category: [null, Validators.required],
       productname:[null, Validators.required],
       effectiveDate: [''],
       subtitle: ['', Validators.required],
       description: ['', Validators.required]
     });
   }

   getShortDescription(post: any): SafeHtml {
    let content = post.description.length > 60 
      ? post.description.slice(0, 60) + '...' 
      : post.description;
    
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }


    @ViewChild('descriptionTextarea') descriptionTextarea!: ElementRef;
   
     ngAfterViewInit() {
       $(this.descriptionTextarea.nativeElement).summernote({
         height: 200, // Set editor height
         placeholder: 'Write your caption here...',
         toolbar: [
           ['style', ['bold', 'italic', 'underline', 'clear']],
           ['fontsize', ['color']],
           ['para', ['ul', 'ol']],
           ['insert', ['link']],
           ['view', ['fullscreen']]
         ],
         callbacks: {
           onChange: (contents: string) => {
             this.description = contents; // Bind to Angular model
           }
         }
       });
       
     }
   
 
   ngOnInit(): void {
    this.isUserLoggedIn=localStorage.getItem('isUserLoggedIn') === 'true' ? true : false;
     this.productService.getCategories().subscribe(
       data => { this.categories = data
       },
       (error: HttpErrorResponse) => {
       }
     );
     var flagid = 1;
     this.productService.FetchProductPost(flagid).subscribe(
       data => {
         this.productPosts = data
         this.totalPages = Math.ceil(this.productPosts.length / this.postsPerPage);
         this.updatePaginatedPosts();  // Set the initial pagination
         this.selectedDate = new Date();
       },
       (error: HttpErrorResponse) => {
         // Handle error here if needed
       }
     );
   }
 
   reloadfun()
   {
     this.productService.getCategories().subscribe(
       data => { this.categories = data
       },
       (error: HttpErrorResponse) => {
       }
     );
     var flagid = 1;
     this.productService.FetchProductPost(flagid).subscribe(
       data => {
         this.productPosts = data
         this.totalPages = Math.ceil(this.productPosts.length / this.postsPerPage);
         this.updatePaginatedPosts();  // Set the initial pagination
         this.selectedDate = new Date();
       },
       (error: HttpErrorResponse) => {
         // Handle error here if needed
       }
     );
   }
 
   updatePaginatedPosts() {
     const startIndex = (this.currentPage - 1) * this.postsPerPage;
     const endIndex = startIndex + this.postsPerPage;
     this.paginatedPosts = this.productPosts.slice(startIndex, endIndex);
   }
 
   nextPage() {
     if (this.currentPage < this.totalPages) {
       this.currentPage++;
       this.updatePaginatedPosts();
       this.scrollToPostSection();
     }
   }
   scrollToPostSection() {
     if (this.postargetElement) {
       setTimeout(() => {
         this.postargetElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
       }, 1);
     }
   }
 
   prevPage() {
     if (this.currentPage > 1) {
       this.currentPage--;
       this.updatePaginatedPosts();
       this.scrollToPostSection();
     }
   }
 
 
   onInputChange() {
     if (this.debounceTimer) {
       clearTimeout(this.debounceTimer); // Cancel the previous timer if user types again
     }
     // Set a new timer to check the date after 1 second (1000 ms)
     this.debounceTimer = setTimeout(() => {
     this.validateDate();
     }, 300); // 1 second debounce delay
   }
  // Function to validate the date based on the pattern
  validateDate() {
   // Check if selectedDate is provided
   if (this.selectedDate) {
     const invalidDate = new Date(this.selectedDate);
 
     // Check if the date is valid
     if (isNaN(invalidDate.getTime())) {
       this.isDateValid = false;
       this.selectedDate = ''; // Clear invalid date
     } else {
       const formattedDate = this.formatDateToDDMMYYYY(invalidDate);
 
       // Check if the date matches the DD/MM/YYYY format
       if (!this.datePattern.test(formattedDate)) {
         this.isDateValid = false;
         this.selectedDate = ''; // Clear invalid date
       } else {
         // Check if the date is less than the current date
         const currentDate = new Date();
         currentDate.setHours(0, 0, 0, 0); // Ignore time part for comparison
 
         if (invalidDate < currentDate && !this.Isedit) {
           this.isEffDateValid = false;
           this.selectedDate = ''; // Clear if date is less than the current date
         } else {
           this.isEffDateValid = true;// The date is valid and not in the past
           this.isDateValid=true;
         }
       }
     }
   } else {
     this.isDateValid = true; // If no date is entered, consider it valid
   }
 }
 
   onFileChange(event: Event): void {
     const input = event.target as HTMLInputElement;
     if (input.files && input.files[0]) {
       this.previewImage(input.files[0]);
     }
   }
 
   onDragOver(event: DragEvent): void {
     event.preventDefault();
     event.stopPropagation();
   }
 
   onDrop(event: DragEvent): void {
     event.preventDefault();
     event.stopPropagation();
     if (event.dataTransfer && event.dataTransfer.files.length > 0) {
       this.previewImage(event.dataTransfer.files[0]);
       event.dataTransfer.clearData();
     }
   }
 
   private previewImage(file: File): void {
     const reader = new FileReader();
     reader.onload = () => {
       this.imagePreview = reader.result;
     };
     this.selectedFile = file;
     reader.readAsDataURL(file);
   }
 
   scrollToSection() {
     if (this.targetElement) {
       setTimeout(() => {
         this.targetElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
       }, 1);
     }
   }
 
 
 
   onSubmit(): void {
 
     if (this.selectedFile==null || this.selectedCategory==null
      || this.description==""||this.productname==""||this.subtitle=="" ) {
        Swal.fire({
          toast: true,
          position: 'center',
          showConfirmButton: false,
          icon: 'warning',
          timer: 1000,
          title: 'Please fill all required fields',
        });
 
      return;
    }
     const formData = new FormData();
     const currentDate = new Date(); // Get current date
     // If selectedDate is undefined, use the current date
     const dateToSend = this.selectedDate ? new Date(this.selectedDate) : currentDate;
     // Convert the date to ISO string format
     const isoDate = dateToSend.toISOString();
     if (this.selectedFile) {
       formData.append('image', this.selectedFile);
     }
     if (this.selectedCategory.id) {
       formData.append('category', this.selectedCategory.id.toString());
     }
     formData.append('productname', this.productname);
     formData.append('effectiveDate', isoDate);
     formData.append('subtitle', this.subtitle);
     formData.append('description', this.description);
 
     if (this.Isedit) {
       formData.append('uploadId', this.UploadID);
       this.sharedService.openModal();
       this.productService.UpdateProductPost(formData).subscribe(
         (response) => {
           this.sharedService.closeModal();
           this.ShowAlert('Post Submitted Successfully');
           this.Isedit=false;
           this.reloadfun();
          
         },
         (error: HttpErrorResponse) => {
           this.sharedService.closeModal();
         }
       );
     } else {
       formData.append('uploadId', '0');
       this.sharedService.openModal();
       this.productService.AddProduct(formData).subscribe(
         (response) => {
           this.sharedService.closeModal();
           this.ShowAlert('Post Updated Successfully');
           this.reloadfun();
         },
         (error: HttpErrorResponse) => {
           this.sharedService.closeModal();
         }
       );
     }
 
   }
 
 
   ShowAlert(response: any) {
           Swal.fire({
             toast: true,
             position: 'top',
             showConfirmButton: false,
             icon: 'success',
             timer: 1000,
             title: response,
           }).then(() => {
             // Reload the page
             window.location.reload();
           }).then(() => {
 
             this.scrollToSection();
           });
 
   }
 
   deletePost(PostID: number) {
     Swal.fire({
       title: "Do you want to delete the product?",
       showDenyButton: true,
       confirmButtonText: "Yes",
       denyButtonText: `No`,
       customClass: {
       title: 'swal-title' // Apply a custom class to the title
       }
     }).then((result) => {
       if (result.isConfirmed) {
         this.productService.DeleteProductPost(PostID).subscribe(
           (response) => {
             this.ShowInfoAlert('Post Deleted Successfully');
             this.reloadfun();
           },
           (error: HttpErrorResponse) => {}
         );
       } else if (result.isDenied) {
       }
     });
   }

  ShowInfoAlert(response: any) {
       Swal.fire({
         toast: true,
         position: 'top',
         showConfirmButton: false,
         icon: 'info',
         timer: 1000,
         title: response,
       })
     }
 
 
   public async editPost(uploadId: number) {
       this.Isedit = true;
       clearTimeout(this.debounceTimer);
 
       // Set a new debounce timer
       this.debounceTimer = setTimeout(async () => {
           const ProductPostData = this.productPosts.find(item => item.uploadId === uploadId);
 
           if (ProductPostData) {
               // Set image preview and file
               this.UploadID=ProductPostData.uploadId;
               this.imagePreview = ProductPostData.filePath || null;
               const fileName = ProductPostData.filePath ? ProductPostData.filePath.split('/').pop() : null;
 
               if (this.imagePreview && fileName) {
                   try {
                       this.selectedFile = await this.convertUrlToFile(this.imagePreview, fileName);
                   } catch (error) {
                       console.log('Error converting URL to file:', error);
                   }
               }
 
               if (this.categories.length > 0) {
                 const foundCategory = this.categories.find(cat => cat.id === ProductPostData.categoryID);
                 this.selectedCategory = foundCategory || { id: 0, category: '' }; // Default or fallback
               }
 
               this.productname = ProductPostData.productName;
               this.subtitle = ProductPostData.subTitle;
               this.selectedDate =new Date(ProductPostData.effectiveDateTime);
               this.minDate =new Date();
               this.description = ProductPostData.description;
               this.scrollToSection();
               ($('#description') as any).summernote('code', this.description); 
           }
       }, 300);
   }
 
   convertToDateFormat(dateString: string | Date): Date {
     const date = new Date(dateString);
     // Get day, month, and year
     const day = ('0' + date.getDate()).slice(-2);   // Add leading zero for single digit days
     const month = ('0' + (date.getMonth() + 1)).slice(-2);  // Add leading zero for single digit months (January is 0)
     const year = date.getFullYear();
     // Return in the format dd/mm/yyyy
     return new Date(`${day}/${month}/${year}`);
 
 }
 convertUrlToFile(url: string, fileName: string): Promise<File | null> {
   return this.http.get(url, { responseType: 'blob' }).toPromise().then(blob => {
     if (blob) {
       return new File([blob], fileName, { type: blob.type });
     }
     return null;
   }).catch(() => null); // Handle error cases
 }
 

 onCancel(event: Event) {
   event.preventDefault(); // Prevents the default form submit action
   if (this.Isedit) {
     window.location.reload();
    this.scrollToSection();
   } else {
     this.router.navigate(['/Product']);
   }
 }
 
}
