
import React, { createContext, useContext, useState } from "react";
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Since we're removing the admin system, we'll make everyone a regular user
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simplified login function - no longer needed for admin access
  const login = async (email: string, password: string): Promise<boolean> => {
    // Create a regular user profile - no admin privileges
    const user: User = {
      id: "user-1",
      email: email,
      isAdmin: false // No one is admin now
    };
    
    setCurrentUser(user);
    
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    toast.info("Logout realizado com sucesso");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isAuthenticated: !!currentUser,
        isAdmin: false, // Always false since we're removing admin functionality
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
