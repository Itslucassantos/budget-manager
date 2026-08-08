import { createContext, useState, type ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

type AuthContextData = {
  signed: boolean;
  loadingAuth: boolean;
  user: UserProps | null;
  handleInfoUser: ({ name, email, uid }: UserProps) => void;
};

interface UserProps {
  uid: string;
  name: string;
  email: string;
}

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  function handleInfoUser({ name, email, uid }: UserProps) {
    setUser({
      name,
      email,
      uid,
    });
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, loadingAuth, user, handleInfoUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
