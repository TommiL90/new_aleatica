/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { CheckCircle2Icon } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Icons } from "@/components/icons";
import { Spinner } from "@/components/kibo-ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { loginWithAzureAd } from "./actions";

const Login = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithAzureAd();
    } catch (error) {
      // Error handling - NextAuth redirects throw errors
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="relative items-center justify-center bg-primary lg:flex">
        <Image
          src="/images/logo.svg"
          alt="Logo de la empresa"
          width="1920"
          height="1080"
          className="w-60 dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="relative flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="font-bold text-3xl">Iniciar Sesión</h1>
            <p className="text-balance text-muted-foreground">
              Ingrese sus credenciales para acceder a su cuenta
            </p>
            <small>v.2.0.0</small>
          </div>
          <div className="grid gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              onClick={handleLogin}
            >
              {isLoading ? (
                <Spinner variant="pinwheel" />
              ) : (
                <Icons.microsoftAzure className="mr-2" />
              )}
              <span> Iniciar Sesión</span>
            </Button>
          </div>
          {error && (
            <Alert variant="destructive">
              <CheckCircle2Icon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Comunícate con el administrador para obtener tus permisos.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
