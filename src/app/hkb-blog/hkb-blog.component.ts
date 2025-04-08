import { Component,ViewChild, ElementRef, OnInit,TemplateRef  } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BlogFetchModel } from '../../Model/BlogFetchModel';
import { Recentpost } from '../../Model/RecentPost';
import { HttpErrorResponse } from '@angular/common/http';
import { BlogPostService } from '../services/blog-post.service';
import { SharedService } from '../services/shared.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-hkb-blog',
  templateUrl: './hkb-blog.component.html',
  styleUrls: ['./hkb-blog.component.css'],
  providers: [DatePipe]
})
export class HKBBlogComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  blogPosts: BlogFetchModel[] = [];
  Recentposts:Recentpost[]=[];
  currentPage: number = 1; // Start on page 1
  pageSize: number = 3; // Show 3 posts per page
  totalPages: number = 0;
  paginatedPosts: BlogFetchModel[] = []; // Posts to display on the current page
  categoryCounts: {  categoryID: number,categoryName: string, count: number }[] = [];
  @ViewChild('targetElement') targetElement!: ElementRef;
  @ViewChild('pageElement') pageElement!: ElementRef;
  searchTerm: string = '';
  filteredItems: any[] = [];
  showDropdown: boolean = false;
  debounceTimer:any;
  SharedUploadID: any;
  routerUrl:any;
  routerName:any;
  isInitialLoad: boolean = true; 
  isUserLoggedIn:boolean = false
  constructor(private datePipe: DatePipe, private blogPostService: BlogPostService,
     private sharedService: SharedService,private sanitizer: DomSanitizer){
   
  }
 // Change this value as needed

  ngOnInit(): void {
    this.isUserLoggedIn=localStorage.getItem('isUserLoggedIn') === 'true' ? true : false;
    const routerInfo = this.sharedService.getRouter();
    this.routerUrl = routerInfo.routerUrl?routerInfo.routerUrl:'/Dashboard';
    this.routerName = routerInfo.routerName?routerInfo.routerName:'Home';
    this.SharedUploadID = this.sharedService.getData(); // Get data
    this.sharedService.openModal();
    this.blogPostService.getBlogPosts().subscribe(
      data => {
        this.blogPosts = data;
        if(this.SharedUploadID)
        {
           this.moveItemToTop(this.SharedUploadID.id)
        }
        this.blogPosts = data;
        this.totalPages = Math.ceil(this.blogPosts.length / this.pageSize);
        this.paginatePosts();
        this.GetRecentposts(this.blogPosts);
        this.GetcategoryCounts(this.blogPosts);
        this.sharedService.closeModal();
      },
      (error: HttpErrorResponse) => {
        // Handle error here if needed
        this.sharedService.closeModal();
      }
    );

    if (this.isInitialLoad) {
      this.initializePosts();
      this.isInitialLoad = false; // Set the flag to false after execution
    }
  }



  getDescription(post: any): SafeHtml {
    const content = this.showFull[post.uploadId] ? post.description : post.description.slice(0, 500);
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }


  initializePosts() {
    if (this.pageElement) {
      this.pageElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  GetcategoryCounts(blogPosts: BlogFetchModel[]) {
    // Group by categoryID and categoryName, and count occurrences
    const categoryCountMap = blogPosts.reduce((acc, post) => {
      const categoryID = post.categoryID;
      const categoryName = post.categoryName;
      
      if (!acc[categoryID]) {
        acc[categoryID] = {
          categoryID,
          categoryName,
          count: 0
        };
      }
  
      acc[categoryID].count++; // Increment the count for the category
  
      return acc;
    }, {} as { [categoryID: number]: { categoryID: number, categoryName: string, count: number } });
  
    // Transform to the desired format
    this.categoryCounts = Object.values(categoryCountMap);
  }
  
  // Paginate the blog posts
  paginatePosts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPosts = this.blogPosts.slice(startIndex, endIndex);
  }


// Get pages to display based on current page
getPagesToDisplay(): number[] {
  const startPage = Math.max(1, this.currentPage - this.pageSize);
  const endPage = Math.min(this.totalPages, this.currentPage + this.pageSize);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
}


// Method to select a page
selectPage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.paginatePosts();
    this.scrollToSection()
  }
}

// Method to go to the next page
goToNextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.paginatePosts();
    this.scrollToSection()
  }
}

// Method to go to the previous page
goToPreviousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.paginatePosts();
    this.scrollToSection()
  }
}


GetRecentposts(blogPosts: BlogFetchModel[]) {
  const topFivePosts = this.blogPosts.slice(0, 5);
  // Push top 5 posts to recentPosts array
  topFivePosts.forEach(post => {
    this.Recentposts.push({
      uploadId: post.uploadId,
      filePath: post.filePath,
      caption: post.caption,
      effectiveDateTime: post.effectiveDateTime
    });
  });
}

// Method to scroll to the element
scrollToSection() {
  if (this.targetElement) {

    setTimeout(() => {
      this.targetElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 1);

  }
}

   // Filter items based on search term
   onSearch() {
    this.filteredItems = this.blogPosts.filter(item =>
      item.caption.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.authorname.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Hide dropdown when losing focus
  hideDropdown() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200); // Small delay to allow click on the dropdown item
  }

  handleSearchAction(item: any): void {
    this.selectItem(item);
    this.moveItemToTop(item.uploadId);
  }

  // Handle item selection
  selectItem(item: any) {
    this.searchTerm = item.caption; // Set the selected item's caption as search term
    this.showDropdown = false; // Close the dropdown
  }
   // Function to move the item with a specific uploadId to the top
   moveItemToTop(uploadId: number) {

    clearTimeout(this.debounceTimer);

    // Set a new debounce timer
    this.debounceTimer = setTimeout(() => {
    const index = this.blogPosts.findIndex(item => item.uploadId === uploadId);
    if (index !== -1) {
      // Remove the item from its current position
      const [item] = this.blogPosts.splice(index, 1);
      // Insert the item at the top of the list
      this.blogPosts.unshift(item);
    }
    this.paginatePosts();
    this.scrollToSection()
  }, 500); // Adjust the delay as needed (300 ms in this case)
}
  


  moveCategoryToTop(categoryID: number) {
  // Clear the previous debounce timer if it's still running
  clearTimeout(this.debounceTimer);

  // Set a new debounce timer
  this.debounceTimer = setTimeout(() => {
    // Filter out the items that match the categoryID
    const matchingItems = this.blogPosts.filter(item => item.categoryID === categoryID);

    if (matchingItems.length > 0) {
      // Remove all matching items from the original list
      this.blogPosts = this.blogPosts.filter(item => item.categoryID !== categoryID);

      // Add the matching items to the top of the list
      this.blogPosts.unshift(...matchingItems);
    }

    this.paginatePosts();
    this.scrollToSection();
  }, 500); // Adjust the delay as needed (300 ms in this case)
  }

  showFull: { [key: number]: boolean } = {}; // To track which post is expanded

  toggleReadMore(uploadId: number, event: Event) {
    event.preventDefault(); // Prevent default link behavior
    this.showFull[uploadId] = !this.showFull[uploadId]; // Toggle read more/less
  }
   


}



