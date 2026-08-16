import { createContext, useEffect, useState, type ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

type AuthContextData = {
  signed: boolean;
  user: UserProps | null;
  loadingAuth: boolean;
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
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as UserProps);
      } catch {
        localStorage.removeItem("user");
      }
    }

    setLoadingAuth(false);
  }, []);

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
      value={{
        signed: !!user,
        user,
        loadingAuth,
        handleInfoUser,
        setUser,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
