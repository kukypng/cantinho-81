
import React, { createContext, useContext, useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar sessão existente e configurar listener de autenticação
  useEffect(() => {
    // Primeiro configurar o listener para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setCurrentUser(session?.user || null);
        
        if (session?.user) {
          // Verificar se o usuário é admin
          const { data, error } = await supabase
            .rpc('has_role', { _role: 'admin' });
            
          if (!error) {
            setIsAdmin(data || false);
          }
        } else {
          setIsAdmin(false);
        }
        
        setIsLoading(false);
      }
    );

    // Depois verificar a sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCurrentUser(session?.user || null);
      
      if (session?.user) {
        // Verificar se o usuário é admin
        supabase
          .rpc('has_role', { _role: 'admin' })
          .then(({ data, error }) => {
            if (!error) {
              setIsAdmin(data || false);
            }
            setIsLoading(false);
          });
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
