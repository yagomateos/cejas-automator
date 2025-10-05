import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Modo demo: Si no hay credenciales configuradas, usar valores demo
const isDemoMode = !supabaseUrl || !supabaseAnonKey;

if (isDemoMode) {
  console.error('❌ ERROR: Variables de entorno de Supabase no configuradas');
  console.log('📝 Variables actuales:');
  console.log('   VITE_SUPABASE_URL:', supabaseUrl || '(vacía)');
  console.log('   VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '(configurada)' : '(vacía)');
  console.log('');
  console.log('🔧 Para desarrollo local:');
  console.log('   1. Copia .env.example a .env');
  console.log('   2. Añade tus credenciales de Supabase');
  console.log('');
  console.log('🚀 Para producción (Netlify):');
  console.log('   1. Ve a Site settings → Environment variables');
  console.log('   2. Añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
  console.log('   3. Redeploy el sitio');
}

// Crear cliente solo si hay credenciales válidas
export const supabase = isDemoMode
  ? createClient('https://demo.supabase.co', 'demo-key')
  : createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          company_name: string | null;
          cif: string | null;
          address: string | null;
          phone: string | null;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          company_name?: string | null;
          cif?: string | null;
          address?: string | null;
          phone?: string | null;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          company_name?: string | null;
          cif?: string | null;
          address?: string | null;
          phone?: string | null;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      clientes: {
        Row: {
          id: string;
          user_id: string;
          nombre: string;
          email: string | null;
          telefono: string | null;
          cif_nif: string | null;
          direccion: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nombre: string;
          email?: string | null;
          telefono?: string | null;
          cif_nif?: string | null;
          direccion?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nombre?: string;
          email?: string | null;
          telefono?: string | null;
          cif_nif?: string | null;
          direccion?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      facturas: {
        Row: {
          id: string;
          user_id: string;
          cliente_id: string | null;
          numero_factura: string;
          fecha: string;
          concepto: string;
          importe_con_iva: number;
          precio_sin_iva: number;
          forma_pago: string;
          estado: 'borrador' | 'emitida' | 'pagada' | 'vencida';
          notas: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          cliente_id?: string | null;
          numero_factura: string;
          fecha: string;
          concepto: string;
          importe_con_iva: number;
          precio_sin_iva: number;
          forma_pago: string;
          estado?: 'borrador' | 'emitida' | 'pagada' | 'vencida';
          notas?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          cliente_id?: string | null;
          numero_factura?: string;
          fecha?: string;
          concepto?: string;
          importe_con_iva?: number;
          precio_sin_iva?: number;
          forma_pago?: string;
          estado?: 'borrador' | 'emitida' | 'pagada' | 'vencida';
          notas?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
