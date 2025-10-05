# 🔧 Solución de Problemas

## ❌ Error 401: "Failed to load resource: the server responded with a status of 401"

Este error ocurre cuando intentas iniciar sesión y las credenciales son inválidas.

### Causas Comunes

#### 1. **Usuario no existe**
- **Solución**: Primero debes **registrarte** en la pestaña "Registrarse"
- Completa: Email, Contraseña (mín 6 caracteres), Nombre de empresa
- Verifica tu email (revisa spam)
- Luego inicia sesión

#### 2. **Email o contraseña incorrectos**
- **Solución**: Verifica que escribiste bien el email y contraseña
- La contraseña es case-sensitive (distingue mayúsculas/minúsculas)

#### 3. **Email no verificado**
- **Solución**: Revisa tu bandeja de entrada (y spam)
- Haz clic en el link de verificación que envió Supabase
- Luego intenta iniciar sesión

#### 4. **Variables de entorno no configuradas en Netlify**
- **Error**: Ves "Modo DEMO" en lugar de login/registro
- **Solución**: Configura las variables en Netlify:

##### En Netlify Dashboard:
1. Ve a tu sitio → **Site settings** → **Environment variables**
2. Añade estas variables:

```
VITE_SUPABASE_URL=https://cyxexwsknxxtxwhnzllh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5eGV4d3Nrbnh4dHh3aG56bGxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjE4MTgsImV4cCI6MjA3NTEzNzgxOH0.iJtWuKMalhcMuzbq3Q00FPTIgHCcxX_a2nG4I5qYsYo
```

3. **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

---

## 🔐 Flujo de Autenticación Correcto

### Primera vez (Registro):
1. ✅ Ir a pestaña **"Registrarse"**
2. ✅ Llenar: Email + Contraseña (6+ chars) + Nombre empresa
3. ✅ Click en "Crear Cuenta"
4. ✅ **IMPORTANTE**: Revisa tu email y verifica
5. ✅ Click en el link de verificación
6. ✅ Vuelve a la app e inicia sesión

### Usuarios existentes (Login):
1. ✅ Ir a pestaña **"Iniciar Sesión"**
2. ✅ Ingresar email y contraseña
3. ✅ Click en "Iniciar Sesión"

---

## 🚨 Otros Errores Comunes

### Error: "Email not confirmed"
**Causa**: No verificaste tu email
**Solución**:
- Revisa tu bandeja de entrada (y spam)
- Busca email de "confirm your email" de Supabase
- Click en el link
- Intenta hacer login nuevamente

### Error: "User already registered"
**Causa**: Ya existe una cuenta con ese email
**Solución**:
- Usa la pestaña "Iniciar Sesión" en lugar de "Registrarse"
- Si olvidaste tu contraseña, contacta soporte

### Error: "Invalid email"
**Causa**: El formato del email no es válido
**Solución**:
- Verifica que tenga formato: `usuario@dominio.com`
- No uses espacios ni caracteres especiales

### Modo DEMO aparece en producción
**Causa**: Variables de entorno no configuradas en Netlify
**Solución**: Ver sección "Variables de entorno no configuradas" arriba

---

## 🐛 Debugging Paso a Paso

Si sigues teniendo problemas:

### 1. Verifica que Supabase esté configurado

```bash
# En tu terminal local
cat .env
```

Deberías ver:
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 2. Verifica que las tablas existan

Ve a Supabase → **Table Editor** y verifica que existan:
- ✅ `profiles`
- ✅ `clientes`
- ✅ `facturas`

Si no existen, ejecuta el script SQL de `SUPABASE_SETUP.md`

### 3. Verifica Row Level Security (RLS)

Ve a Supabase → **Authentication** → **Policies**

Cada tabla debe tener políticas:
- ✅ SELECT (view own)
- ✅ INSERT (insert own)
- ✅ UPDATE (update own)
- ✅ DELETE (delete own)

### 4. Prueba crear un usuario manualmente en Supabase

1. Ve a **Authentication** → **Users**
2. Click en **"Add user"** → **"Create new user"**
3. Ingresa email y contraseña
4. Confirma el email automáticamente
5. Intenta hacer login con esas credenciales

### 5. Revisa la consola del navegador

1. Abre DevTools (F12)
2. Ve a la pestaña **Console**
3. Busca errores en rojo
4. Busca la pestaña **Network**
5. Filtra por "token" o "auth"
6. Revisa los detalles de la respuesta 401

---

## 📧 Verificación de Email

### Si no recibes el email de verificación:

1. **Revisa spam/junk**
2. **Espera 5-10 minutos** (puede demorar)
3. **Verifica el email en Supabase manualmente**:
   - Ve a **Authentication** → **Users**
   - Busca tu email
   - Click en el usuario
   - Click en **"Confirm email"**

### Reenviar email de verificación:

Supabase no tiene opción de reenviar por defecto. Opciones:

1. **Opción A**: Crear otra cuenta con otro email
2. **Opción B**: Verificar manualmente en Supabase (ver arriba)
3. **Opción C**: Contactar al admin para que lo verifique

---

## 🔑 Contraseñas

### Requisitos:
- ✅ Mínimo 6 caracteres
- ✅ Puede contener letras, números, símbolos
- ✅ Case-sensitive (distingue mayúsculas)

### Si olvidaste tu contraseña:
Actualmente no hay opción de "recuperar contraseña". Opciones:

1. **Crear nueva cuenta** con otro email
2. **Contactar al admin** para resetear manualmente en Supabase

---

## 🆘 Contacto Soporte

Si ninguna solución funciona:

1. **GitHub Issues**: https://github.com/yagomateos/cejas-automator/issues
2. **Email**: yago@example.com
3. **Incluye**:
   - Descripción del error
   - Screenshot de la consola (F12)
   - Pasos que seguiste
   - ¿Local o producción (Netlify)?
