-- ============================================
-- SCRIPT DE ARREGLO COMPLETO PARA SUPABASE
-- ============================================
-- Ejecuta este script completo en SQL Editor de Supabase
-- Esto arreglará todos los problemas de autenticación

-- 1. VERIFICAR Y ARREGLAR TABLAS
-- ============================================

-- Borrar tablas existentes si tienen problemas
DROP TABLE IF EXISTS public.facturas CASCADE;
DROP TABLE IF EXISTS public.clientes CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de perfiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  company_name TEXT,
  cif TEXT,
  address TEXT,
  phone TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de clientes
CREATE TABLE public.clientes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  nombre TEXT NOT NULL,
  email TEXT,
  telefono TEXT,
  cif_nif TEXT,
  direccion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de facturas
CREATE TABLE public.facturas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  numero_factura TEXT NOT NULL,
  fecha DATE NOT NULL,
  concepto TEXT NOT NULL,
  importe_con_iva DECIMAL(10,2) NOT NULL,
  precio_sin_iva DECIMAL(10,2) NOT NULL,
  forma_pago TEXT NOT NULL,
  estado TEXT DEFAULT 'emitida' CHECK (estado IN ('borrador', 'emitida', 'pagada', 'vencida')),
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_clientes_user_id ON public.clientes(user_id);
CREATE INDEX idx_facturas_user_id ON public.facturas(user_id);
CREATE INDEX idx_facturas_cliente_id ON public.facturas(cliente_id);
CREATE INDEX idx_facturas_fecha ON public.facturas(fecha);
CREATE INDEX idx_facturas_numero ON public.facturas(numero_factura);

-- 2. CONFIGURAR RLS (Row Level Security)
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facturas ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para clientes
DROP POLICY IF EXISTS "Users can view own clientes" ON public.clientes;
DROP POLICY IF EXISTS "Users can insert own clientes" ON public.clientes;
DROP POLICY IF EXISTS "Users can update own clientes" ON public.clientes;
DROP POLICY IF EXISTS "Users can delete own clientes" ON public.clientes;

CREATE POLICY "Users can view own clientes" ON public.clientes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clientes" ON public.clientes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clientes" ON public.clientes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clientes" ON public.clientes
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para facturas
DROP POLICY IF EXISTS "Users can view own facturas" ON public.facturas;
DROP POLICY IF EXISTS "Users can insert own facturas" ON public.facturas;
DROP POLICY IF EXISTS "Users can update own facturas" ON public.facturas;
DROP POLICY IF EXISTS "Users can delete own facturas" ON public.facturas;

CREATE POLICY "Users can view own facturas" ON public.facturas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own facturas" ON public.facturas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own facturas" ON public.facturas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own facturas" ON public.facturas
  FOR DELETE USING (auth.uid() = user_id);

-- 3. TRIGGERS Y FUNCIONES
-- ============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_clientes_updated_at ON public.clientes;
DROP TRIGGER IF EXISTS update_facturas_updated_at ON public.facturas;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_facturas_updated_at
  BEFORE UPDATE ON public.facturas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. CREAR USUARIO DE PRUEBA
-- ============================================
-- IMPORTANTE: Cambia estos datos por los que quieras

DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Intentar crear usuario de prueba
  -- Nota: Esto puede fallar si el usuario ya existe
  BEGIN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@test.com',
      crypt('admin123', gen_salt('bf')), -- Contraseña: admin123
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      FALSE,
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO test_user_id;

    -- Crear perfil para el usuario
    INSERT INTO public.profiles (id, email, company_name)
    VALUES (test_user_id, 'admin@test.com', 'Empresa de Prueba');

    RAISE NOTICE 'Usuario de prueba creado: admin@test.com / admin123';
  EXCEPTION
    WHEN unique_violation THEN
      RAISE NOTICE 'El usuario admin@test.com ya existe';
  END;
END $$;

-- 5. VERIFICACIÓN FINAL
-- ============================================

-- Verificar tablas creadas
SELECT 'TABLAS CREADAS:' as status;
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'clientes', 'facturas');

-- Verificar políticas RLS
SELECT 'POLÍTICAS RLS:' as status;
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';

-- Verificar triggers
SELECT 'TRIGGERS:' as status;
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';

-- Verificar usuarios
SELECT 'USUARIOS:' as status;
SELECT email, email_confirmed_at IS NOT NULL as confirmed, created_at
FROM auth.users
LIMIT 5;

-- LISTO!
SELECT '✅ CONFIGURACIÓN COMPLETADA' as status;
SELECT 'Puedes usar: admin@test.com / admin123 para iniciar sesión' as info;
