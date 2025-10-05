import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

// Modo demo: Si no hay credenciales configuradas, usar valores demo
const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

if (isDemoMode) {
  console.warn('⚠️ Modo DEMO: Configura Supabase en .env para guardar datos');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
