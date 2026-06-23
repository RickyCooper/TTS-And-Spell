export interface User {
  id: string;
  username: string;
  email: string;
  dateOfBirth: string;
}

export interface LoginInput {
  identifier: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  dateOfBirth: string;
  username: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
