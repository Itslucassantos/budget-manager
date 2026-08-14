import { createContext, useState, type ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

type AuthContextData = {
  signed: boolean;
  user: UserProps | null;
  handleInfoUser: ({ name, email, uid }: UserProps) => void;
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
  handleLogout: () => void;
};

interface UserProps {
  uid: string;
  name: string;
  email: string;
}

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);

  function handleInfoUser({ name, email, uid }: UserProps) {
    setUser({
      name,
      email,
      uid,
    });
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, handleInfoUser, setUser, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
