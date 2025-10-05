import { InvoiceProcessor } from "@/components/InvoiceProcessor";
import { Auth } from "@/components/Auth";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();

  // Modo demo: permitir acceso sin autenticación si no hay Supabase configurado
  const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si está en modo demo, mostrar directamente el procesador
  if (isDemoMode) {
    return (
      <div>
        <div className="bg-yellow-500/10 border border-yellow-500/50 p-4 m-4 rounded-lg">
          <p className="text-yellow-700 dark:text-yellow-300 font-medium">
            ⚠️ Modo DEMO - Los datos NO se guardarán. Configura Supabase para persistencia.
          </p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
            Sigue las instrucciones en <code>SUPABASE_SETUP.md</code>
          </p>
        </div>
        <InvoiceProcessor />
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return <InvoiceProcessor />;
};

export default Index;
