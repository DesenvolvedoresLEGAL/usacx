import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";
import { logger } from "@/lib/logger";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    logger.warn("404 Error: User attempted to access non-existent route", {
      pathname: location.pathname,
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-lg border-2 shadow-xl text-center">
        <CardHeader className="space-y-4 pb-2">
          <div className="mx-auto w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-7xl font-bold text-primary">
              404
            </CardTitle>
            <CardTitle className="text-2xl font-semibold">
              Página não encontrada
            </CardTitle>
          </div>
          <CardDescription className="text-base max-w-sm mx-auto">
            A página que você está procurando não existe ou foi movida para outro endereço.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="min-w-40">
              <Link to="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Ir ao Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-40">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground pt-4">
            Rota tentada: <code className="px-2 py-1 bg-muted rounded text-xs">{location.pathname}</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
