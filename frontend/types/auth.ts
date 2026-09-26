import { User } from "./user";

export interface LoginResponseData {
  accessToken: string;
  tokenType: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHR: boolean;
  isPegawai: boolean;
  login: (nip: string, password?: string) => Promise<boolean>;
  logout: () => void;
}
