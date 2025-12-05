import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { loginSchema, signupSchema, formatZodError } from '@/lib/validations';

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, role, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupDisplayName, setSignupDisplayName] = useState('');

  // Form errors
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  const [signupErrors, setSignupErrors] = useState<{ email?: string; password?: string; displayName?: string }>({});

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && user && role) {
      // Smart redirect based on role
      if (role === 'agent') {
        navigate('/conversations', { replace: true });
      } else if (role === 'manager') {
        navigate('/dashboard', { replace: true });
      } else if (role === 'admin') {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, role, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});
    
    // Validate with Zod
    const result = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach(err => {
        if (err.path[0] === 'email') fieldErrors.email = err.message;
        if (err.path[0] === 'password') fieldErrors.password = err.message;
      });
      setLoginErrors(fieldErrors);
      toast.error(formatZodError(result.error));
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(result.data.email, result.data.password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email ou senha incorretos');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Por favor, confirme seu email antes de fazer login');
        } else {
          toast.error('Erro ao fazer login. Tente novamente.');
        }
      } else {
        toast.success('Login realizado com sucesso!');
      }
    } catch {
      toast.error('Erro inesperado ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupErrors({});

    // Validate with Zod
    const result = signupSchema.safeParse({ 
      email: signupEmail, 
      password: signupPassword, 
      displayName: signupDisplayName 
    });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string; displayName?: string } = {};
      result.error.errors.forEach(err => {
        if (err.path[0] === 'email') fieldErrors.email = err.message;
        if (err.path[0] === 'password') fieldErrors.password = err.message;
        if (err.path[0] === 'displayName') fieldErrors.displayName = err.message;
      });
      setSignupErrors(fieldErrors);
      toast.error(formatZodError(result.error));
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp(result.data.email, result.data.password, result.data.displayName);
      
      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Este email já está cadastrado');
        } else if (error.message.includes('Invalid email')) {
          toast.error('Email inválido');
        } else {
          toast.error('Erro ao criar conta. Tente novamente.');
        }
      } else {
        toast.success('Conta criada com sucesso! Você já pode fazer login.');
      }
    } catch {
      toast.error('Erro inesperado ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Icons.logo className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Bem-vindo à USAC</CardTitle>
          <CardDescription>Plataforma de Atendimento</CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Cadastrar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className={loginErrors.email ? 'border-destructive' : ''}
                    aria-invalid={!!loginErrors.email}
                    aria-describedby={loginErrors.email ? 'login-email-error' : undefined}
                  />
                  {loginErrors.email && (
                    <p id="login-email-error" className="text-xs text-destructive">{loginErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className={loginErrors.password ? 'border-destructive' : ''}
                    aria-invalid={!!loginErrors.password}
                    aria-describedby={loginErrors.password ? 'login-password-error' : undefined}
                  />
                  {loginErrors.password && (
                    <p id="login-password-error" className="text-xs text-destructive">{loginErrors.password}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
                <Button variant="link" size="sm" className="text-sm text-muted-foreground">
                  Esqueceu sua senha?
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignup}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nome de exibição</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Seu nome"
                    value={signupDisplayName}
                    onChange={(e) => setSignupDisplayName(e.target.value)}
                    disabled={isLoading}
                    className={signupErrors.displayName ? 'border-destructive' : ''}
                    aria-invalid={!!signupErrors.displayName}
                  />
                  {signupErrors.displayName && (
                    <p className="text-xs text-destructive">{signupErrors.displayName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className={signupErrors.email ? 'border-destructive' : ''}
                    aria-invalid={!!signupErrors.email}
                  />
                  {signupErrors.email && (
                    <p className="text-xs text-destructive">{signupErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={6}
                    className={signupErrors.password ? 'border-destructive' : ''}
                    aria-invalid={!!signupErrors.password}
                  />
                  {signupErrors.password && (
                    <p className="text-xs text-destructive">{signupErrors.password}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Criando conta...' : 'Criar conta'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default LoginPage;
