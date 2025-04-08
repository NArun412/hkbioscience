export interface Chatlog {
   logDatetime:Date;
   emailId?: string|'';
   request?: string;
   intentId: number|null|undefined;
   isNomatch?: boolean ;
 }