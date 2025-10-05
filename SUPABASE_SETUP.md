# Configuración de Supabase

## Paso 1: Crear cuenta en Supabase

1. Ve a https://supabase.com
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto

## Paso 2: Obtener credenciales

1. Ve a **Settings** → **API** en tu proyecto de Supabase
2. Copia el **Project URL** y el **anon/public key**
3. Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

4. Pega tus credenciales en `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

## Paso 3: Crear las tablas en Supabase

Ve a **SQL Editor** en Supabase y ejecuta este script:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de perfiles de usuario
CREATE TABLE profiles (
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
CREATE TABLE clientes (
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
CREATE TABLE facturas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
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

-- Índices para mejorar performance
CREATE INDEX idx_clientes_user_id ON clientes(user_id);
CREATE INDEX idx_facturas_user_id ON facturas(user_id);
CREATE INDEX idx_facturas_cliente_id ON facturas(cliente_id);
CREATE INDEX idx_facturas_fecha ON facturas(fecha);
CREATE INDEX idx_facturas_numero ON facturas(numero_factura);

-- RLS (Row Level Security) - Solo los usuarios pueden ver sus propios datos
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE facturas ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para clientes
CREATE POLICY "Users can view own clientes" ON clientes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clientes" ON clientes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clientes" ON clientes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clientes" ON clientes
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para facturas
CREATE POLICY "Users can view own facturas" ON facturas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own facturas" ON facturas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own facturas" ON facturas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own facturas" ON facturas
  FOR DELETE USING (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_facturas_updated_at BEFORE UPDATE ON facturas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Paso 4: Configurar Authentication

1. Ve a **Authentication** → **Providers** en Supabase
2. Habilita **Email** provider
3. (Opcional) Configura otros providers como Google, GitHub, etc.

## Paso 5: Probar la aplicación

```bash
npm run dev
```

La aplicación ahora tiene:
- ✅ Autenticación de usuarios
- ✅ Base de datos para guardar facturas
- ✅ Gestión de clientes
- ✅ Seguridad con Row Level Security
- ✅ Actualización automática de timestamps

## Estructura de Datos

### Profiles
- Datos de la empresa del usuario
- Logo, CIF, dirección, etc.

### Clientes
- Base de datos de clientes
- Vinculados al usuario

### Facturas
- Todas las facturas procesadas
- Vinculadas a clientes
- Estados: borrador, emitida, pagada, vencida
