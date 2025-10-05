import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { checkSupabaseAuth } from '@/lib/checkSupabaseConfig';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Lock, Building2 } from 'lucide-react';

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Verificar configuración de Supabase al montar
    checkSupabaseAuth().then(result => {
      if (!result.isConfigured) {
        toast({
          title: '⚠️ Configuración incompleta',
          description: result.error || 'Verifica la configuración de Supabase',
          variant: 'destructive',
        });
      }
    });
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔐 Intentando iniciar sesión con:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Error de autenticación:', error);
        throw error;
      }

      console.log('✅ Login exitoso:', data.user?.email);

      toast({
        title: '¡Bienvenido!',
        description: 'Has iniciado sesión correctamente',
      });
    } catch (error: any) {
      console.error('❌ Error completo:', error);

      let errorMessage = error.message;
      let errorTitle = 'Error al iniciar sesión';

      // Mensajes de error más claros
      if (error.message.includes('Invalid login credentials')) {
        errorTitle = 'Credenciales inválidas';
        errorMessage = 'El email o la contraseña son incorrectos. Por favor verifica e intenta de nuevo.';
      } else if (error.message.includes('Email not confirmed')) {
        errorTitle = 'Email no verificado';
        errorMessage = 'Debes verificar tu email antes de iniciar sesión. Revisa tu bandeja de entrada (y spam).';
      } else if (error.message.includes('User not found')) {
        errorTitle = 'Usuario no encontrado';
        errorMessage = 'No existe una cuenta con este email. Por favor regístrate primero.';
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('📝 Registrando usuario:', email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_name: companyName,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error('❌ Error al registrar:', error);
        throw error;
      }

      console.log('✅ Usuario registrado:', data);

      // Si Supabase tiene confirmación de email desactivada, el usuario ya está activo
      if (data.user && !data.user.confirmed_at && data.user.identities?.length === 0) {
        toast({
          title: '⚠️ Revisa tu email',
          description: 'Hemos enviado un link de verificación. Si no lo recibes, contacta al administrador.',
        });
      } else {
        toast({
          title: '¡Cuenta creada!',
          description: 'Ya puedes iniciar sesión con tu email y contraseña',
        });
        // Limpiar campos
        setEmail('');
        setPassword('');
        setCompanyName('');
      }
    } catch (error: any) {
      console.error('❌ Error completo:', error);

      let errorMessage = error.message;
      let errorTitle = 'Error al registrarse';

      // Mensajes de error más claros
      if (error.message.includes('User already registered')) {
        errorTitle = 'Usuario ya existe';
        errorMessage = 'Ya existe una cuenta con este email. Ve a "Iniciar Sesión".';
      } else if (error.message.includes('Password should be at least')) {
        errorTitle = 'Contraseña muy corta';
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      } else if (error.message.includes('Invalid email')) {
        errorTitle = 'Email inválido';
        errorMessage = 'El formato del email no es válido';
      } else if (error.message.includes('Signup is disabled')) {
        errorTitle = 'Registro deshabilitado';
        errorMessage = 'El registro está deshabilitado en Supabase. Contacta al administrador.';
      } else if (error.status === 401 || error.status === 403) {
        errorTitle = 'Acceso denegado';
        errorMessage = 'Supabase bloqueó el registro. Verifica la configuración de Authentication → Email Provider.';
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-elegant">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Procesador de Facturas
          </h1>
          <p className="text-muted-foreground">
            Gestiona tus facturas de forma profesional
          </p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="signup">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                💡 <strong>¿Primera vez?</strong> Usa la pestaña "Registrarse" para crear tu cuenta.
              </p>
            </div>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">
                ✅ <strong>Después de registrarte:</strong> Verifica tu email antes de iniciar sesión.
              </p>
            </div>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-company">Nombre de la Empresa</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-company"
                    type="text"
                    placeholder="Mi Empresa S.L."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Mínimo 6 caracteres
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
