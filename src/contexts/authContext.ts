import { createContext } from "react";

export interface UserProps {
  uid: string;
  name: string;
  email: string;
}

export type AuthContextData = {
  signed: boolean;
  user: UserProps | null;
  loadingAuth: boolean;
  handleInfoUser: ({ name, email, uid }: UserProps) => void;
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
  handleLogout: () => void;
};

export const AuthContext = createContext({} as AuthContextData);
