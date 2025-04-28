
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { toast } from "sonner";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

interface UserCredentials {
  email: string;
  password: string;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default admin user
const DEFAULT_ADMIN: UserCredentials = {
  email: "admin@parceiro1store.com",
  password: "admin123",
  isAdmin: true
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mock login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // Check for default admin first
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      const user: User = {
        id: "admin-1",
        email: DEFAULT_ADMIN.email,
        isAdmin: true
      };
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      toast.success("Login realizado com sucesso!");
      return true;
    }
    
    // Check for user credentials stored in localStorage
    try {
      const savedCredentials = localStorage.getItem("userCredentials");
      if (savedCredentials) {
        const credentials: UserCredentials[] = JSON.parse(savedCredentials);
        const matchedUser = credentials.find(
          cred => cred.email === email && cred.password === password
        );
        
        if (matchedUser) {
          const user: User = {
            id: email, // Use email as ID
            email: email,
            isAdmin: matchedUser.isAdmin
          };
          setCurrentUser(user);
          localStorage.setItem("currentUser", JSON.stringify(user));
          toast.success("Login realizado com sucesso!");
          return true;
        }
      }
    } catch (error) {
      console.error("Failed during login:", error);
    }
    
    toast.error("Email ou senha inválidos");
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    toast.info("Logout realizado com sucesso");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.isAdmin || false,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
