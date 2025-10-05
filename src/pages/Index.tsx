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

  // Si está en modo demo, mostrar error de configuración
  if (isDemoMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto mt-20">
          <div className="bg-red-500/10 border-2 border-red-500/50 p-8 rounded-xl">
            <h1 className="text-3xl font-bold text-red-700 dark:text-red-300 mb-4">
              ❌ Error de Configuración
            </h1>
            <p className="text-lg text-red-600 dark:text-red-400 mb-6">
              Las variables de entorno de Supabase no están configuradas.
            </p>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">🚀 Para Netlify (Producción):</h2>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Ve a tu sitio en <a href="https://app.netlify.com" target="_blank" className="text-primary underline">Netlify Dashboard</a></li>
                <li>Click en <strong>Site settings</strong> → <strong>Environment variables</strong></li>
                <li>Añade estas variables:
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2 font-mono text-xs">
                    <div>VITE_SUPABASE_URL=https://cyxexwsknxxtxwhnzllh.supabase.co</div>
                    <div className="mt-1">VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5eGV4d3Nrbnh4dHh3aG56bGxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjE4MTgsImV4cCI6MjA3NTEzNzgxOH0.iJtWuKMalhcMuzbq3Q00FPTIgHCcxX_a2nG4I5qYsYo</div>
                  </div>
                </li>
                <li>Ve a <strong>Deploys</strong> → <strong>Trigger deploy</strong> → <strong>Clear cache and deploy site</strong></li>
                <li>Espera 1-2 minutos y recarga esta página</li>
              </ol>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">💻 Para Desarrollo Local:</h2>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Copia el archivo de ejemplo: <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">cp .env.example .env</code></li>
                <li>Edita <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">.env</code> con tus credenciales de Supabase</li>
                <li>Reinicia el servidor de desarrollo: <code className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">npm run dev</code></li>
              </ol>
            </div>

            <div className="mt-6 text-sm text-muted-foreground">
              📖 Para más ayuda, consulta <a href="https://github.com/yagomateos/cejas-automator/blob/master/SUPABASE_SETUP.md" target="_blank" className="text-primary underline">SUPABASE_SETUP.md</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return <InvoiceProcessor />;
};

export default Index;
