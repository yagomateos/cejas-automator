import { supabase } from './supabase';

export async function checkSupabaseAuth() {
  try {
    // Intentar obtener la sesión actual
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('❌ Error al verificar sesión:', error);
      return {
        isConfigured: false,
        error: 'No se puede conectar a Supabase',
        details: error.message
      };
    }

    // Verificar que la URL y key sean válidas
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key || url === 'https://demo.supabase.co' || key === 'demo-key') {
      return {
        isConfigured: false,
        error: 'Variables de entorno no configuradas',
        details: 'Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY'
      };
    }

    console.log('✅ Supabase configurado correctamente');
    console.log('📊 URL:', url);
    console.log('🔑 Key:', key ? '(configurada)' : '(vacía)');
    console.log('👤 Sesión activa:', session ? 'Sí' : 'No');

    return {
      isConfigured: true,
      hasSession: !!session,
      url,
    };
  } catch (error: any) {
    console.error('❌ Error al verificar Supabase:', error);
    return {
      isConfigured: false,
      error: 'Error desconocido',
      details: error.message
    };
  }
}

// Auto-ejecutar al importar
checkSupabaseAuth();
