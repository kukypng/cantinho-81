
import React, { createContext, useContext, useState } from "react";
import { User, Session } from '@supabase/supabase-js';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Removemos os useEffects de verificação de sessão existente

  // Login com Supabase
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      // Verificar se o usuário é admin após login
      if (data.user) {
        const { data: roleData, error: roleError } = await supabase
          .rpc('has_role', { _role: 'admin' });
          
        if (!roleError) {
          setIsAdmin(roleData || false);
        }
        
        // Se não for admin, fazer logout e mostrar mensagem
        if (!roleData) {
          await supabase.auth.signOut();
          toast.error("Acesso restrito apenas para administradores");
          return false;
        }

        // Definir manualmente o usuário e sessão
        setCurrentUser(data.user);
        setSession(data.session);
        
        toast.success("Login realizado com sucesso!");
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Erro no login:", error.message);
      toast.error(error.message || "Erro ao fazer login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout com Supabase
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // Limpar manualmente os estados
      setCurrentUser(null);
      setSession(null);
      setIsAdmin(false);
      toast.info("Logout realizado com sucesso");
    } catch (error: any) {
      console.error("Erro no logout:", error.message);
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        session,
        login,
        logout,
        isAuthenticated: !!currentUser,
        isAdmin,
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
