export class Login 
{
  LoginID ?: number 
 Username ?: string;
 PasswordHash ?: string;
 Email ?: string;
 CreatedAt ?: string;
 IsActive?: string;
 Role ?: string;
}

export class ResetLink 
{
  Email_Address ?: string;
  Rest_Url ?: string;
}