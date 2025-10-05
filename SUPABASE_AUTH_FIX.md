# 🔧 Solución Error 401 en Registro (Signup)

## 🚨 Error: `Failed to load resource: /auth/v1/signup:1 (401)`

Este error ocurre cuando intentas **registrarte** y Supabase rechaza la petición.

## ✅ Solución Rápida

### Paso 1: Habilitar Registro de Usuarios en Supabase

1. **Ve a tu proyecto en Supabase**: https://app.supabase.com
2. **Authentication** → **Providers**
3. **Email Provider** debe estar habilitado:
   - ✅ **Enable Email provider** → ON
   - ✅ **Confirm email** → Puedes dejarlo ON o desactivarlo temporalmente para testing
4. **Guarda los cambios**

### Paso 2: Verificar URL de Redirección

1. **Authentication** → **URL Configuration**
2. Añade estas URLs a **Redirect URLs**:
   ```
   http://localhost:8080/*
   http://localhost:8081/*
   https://tu-sitio.netlify.app/*
   ```
3. **Site URL**:
   - Para dev: `http://localhost:8080`
   - Para prod: `https://tu-sitio.netlify.app`

### Paso 3: Verificar Email Settings

1. **Authentication** → **Email Templates**
2. Verifica que los templates estén configurados
3. Para testing rápido, puedes:
   - Ir a **Settings** → **Authentication**
   - **Enable email confirmations** → OFF (temporalmente)
   - Esto permite registrarse sin verificar email

---

## 🔍 Debugging Paso a Paso

### Opción 1: Desactivar confirmación de email (Solo para testing)

1. Supabase → **Authentication** → **Settings**
2. Busca **"Email confirmations"** o **"Confirm email"**
3. Desactiva temporalmente
4. Intenta registrarte de nuevo
5. ✅ Si funciona → el problema era la configuración de emails
6. ❌ Si no funciona → continúa con Opción 2

### Opción 2: Verificar políticas RLS

El problema puede ser que las políticas RLS bloqueen la creación del perfil.

1. Ve a **SQL Editor** en Supabase
2. Ejecuta este query para verificar políticas:

```sql
-- Ver políticas de la tabla profiles
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

3. Si no hay política de INSERT, añádela:

```sql
-- Permitir insertar perfiles al registrarse
CREATE POLICY "Users can insert own profile during signup"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);
```

### Opción 3: Verificar el Trigger

El trigger debe crear el perfil automáticamente:

```sql
-- Verificar que el trigger existe
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

Si no existe, créalo:

```sql
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

---

## ⚡ Solución Rápida (Sin Email)

Si solo quieres probar la app rápidamente:

### Método 1: Crear usuario manualmente en Supabase

1. **Authentication** → **Users** → **Add user**
2. **Create new user**:
   - Email: `test@test.com`
   - Password: `test123456`
   - ✅ **Auto Confirm User** → ON
3. **Create user**
4. Usa estas credenciales para iniciar sesión en la app

### Método 2: Usar modo testing sin confirmación

1. **Authentication** → **Settings**
2. **Email Auth** → **Confirm email** → OFF
3. Intenta registrarte normalmente
4. No necesitarás verificar el email

---

## 📋 Checklist de Configuración Auth

Verifica que todo esté configurado:

- [ ] **Email Provider** está habilitado
- [ ] **Redirect URLs** incluyen localhost y Netlify
- [ ] **Site URL** está configurada
- [ ] **Email templates** existen
- [ ] **RLS policies** permiten INSERT en profiles
- [ ] **Trigger** para crear perfil existe
- [ ] Opcionalmente: **Email confirmation** desactivada para testing

---

## 🐛 Verificar en la Consola

Abre DevTools (F12) y busca:

```
🔐 Intentando iniciar sesión con: tu@email.com
❌ Error de autenticación: ...
```

Los posibles errores:

### `"Invalid login credentials"` (401)
- **Causa**: Usuario no existe o contraseña incorrecta
- **Solución**: Regístrate primero o verifica credenciales

### `"Email not confirmed"` (401)
- **Causa**: Email no verificado
- **Solución**: Verifica email o desactiva confirmación

### `"User already registered"` (422)
- **Causa**: Ya existe cuenta con ese email
- **Solución**: Usa "Iniciar Sesión" en lugar de "Registrarse"

### `"Signup is disabled"` (403)
- **Causa**: Registro desactivado en Supabase
- **Solución**: Habilita Email Provider en Supabase

---

## 🔄 Orden de Prueba

Prueba en este orden:

1. ✅ **Verificar Email Provider habilitado** (lo más común)
2. ✅ **Desactivar email confirmation** (para testing)
3. ✅ **Crear usuario manualmente** en Supabase
4. ✅ **Verificar políticas RLS** de profiles
5. ✅ **Verificar trigger** de creación de perfil

---

## 🆘 Si nada funciona

Crea un usuario de prueba manualmente:

1. Supabase → **Authentication** → **Users**
2. **Add user** → **Create new user**
3. Email: cualquiera (ej: `prueba@test.com`)
4. Password: mínimo 6 caracteres
5. ✅ **Auto Confirm User**
6. **Create**
7. Usa esas credenciales en la app

Esto garantiza que puedas entrar y probar la funcionalidad.

---

## 📧 Contacto

Si sigues teniendo problemas:
- GitHub Issues: https://github.com/yagomateos/cejas-automator/issues
- Incluye:
  - Screenshot del error completo
  - Screenshot de Auth settings en Supabase
  - ¿Puedes crear usuario manualmente en Supabase?
