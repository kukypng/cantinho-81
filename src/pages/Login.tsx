
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ChevronLeft } from "lucide-react";
import StoreLayout from "@/components/layout/StoreLayout";
import { useStore } from "@/context/StoreContext";

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useStore();
  
  const from = (location.state as LocationState)?.from?.pathname || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        // Redirect to the page they tried to visit or admin dashboard
        navigate(from, { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StoreLayout showHeader={false} showFooter={false}>
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")} 
            className="mb-6 pl-0"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para loja
          </Button>
          
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                {settings.storeName}
              </CardTitle>
              <CardDescription className="text-center">
                Faça login para acessar o painel administrativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="vai embora"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Senha
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-store-pink hover:bg-store-pink/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center text-center text-sm text-gray-500">
              <p>Sai daqui demonio</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Login;
