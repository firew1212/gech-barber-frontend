
export interface LoginDto {
  phoneNumber: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  phoneNumber: string;
  password: string;
}

export interface AuthUser {
  userId: string;
  phoneNumber: string;
  
}

export interface AuthResponse {
  access_token: string;
  user?: AuthUser;
}