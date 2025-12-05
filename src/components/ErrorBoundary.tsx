import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error for debugging
    logger.error('ErrorBoundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // Here you could send to an error tracking service
    // e.g., Sentry, LogRocket, etc.
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
          <Card className="w-full max-w-lg border-2 shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Ops! Algo deu errado
              </CardTitle>
              <CardDescription className="text-base">
                Ocorreu um erro inesperado na aplicação. Nossa equipe foi notificada e está trabalhando para resolver.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <p className="text-sm font-mono text-destructive break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={this.handleReload} 
                  className="flex-1"
                  size="lg"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Recarregar Página
                </Button>
                <Button 
                  onClick={this.handleGoHome} 
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Ir para Início
                </Button>
              </div>
              
              <p className="text-xs text-center text-muted-foreground pt-2">
                Se o problema persistir, entre em contato com o suporte técnico.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
