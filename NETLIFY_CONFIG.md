# 🚀 Configuración de Netlify

## Paso 1: Desplegar en Netlify

### Opción A: Desde GitHub (Recomendado)

1. Ve a [Netlify](https://app.netlify.com)
2. Click en **"Add new site"** → **"Import an existing project"**
3. Selecciona **GitHub**
4. Busca y selecciona `yagomateos/cejas-automator`
5. Configuración del build:
   ```
   Build command: npm run build
   Publish directory: dist
   ```
6. Click en **"Deploy site"**

### Opción B: Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Desplegar
netlify deploy --prod
```

---

## ⚠️ Paso 2: Configurar Variables de Entorno (IMPORTANTE)

**Sin este paso, la app no funcionará en producción.**

### Variables Requeridas:

```env
VITE_SUPABASE_URL=https://cyxexwsknxxtxwhnzllh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5eGV4d3Nrbnh4dHh3aG56bGxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjE4MTgsImV4cCI6MjA3NTEzNzgxOH0.iJtWuKMalhcMuzbq3Q00FPTIgHCcxX_a2nG4I5qYsYo
```

### Cómo añadirlas en Netlify Dashboard:

1. **Ve a tu sitio** en [Netlify Dashboard](https://app.netlify.com)
2. **Site settings** → **Environment variables** (o Build & deploy → Environment)
3. Click en **"Add a variable"** o **"Edit variables"**
4. Añade cada variable:

   **Variable 1:**
   ```
   Key: VITE_SUPABASE_URL
   Value: https://cyxexwsknxxtxwhnzllh.supabase.co
   Scopes: All (Production, Deploy Previews, Branch deploys)
   ```

   **Variable 2:**
   ```
   Key: VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5eGV4d3Nrbnh4dHh3aG56bGxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NjE4MTgsImV4cCI6MjA3NTEzNzgxOH0.iJtWuKMalhcMuzbq3Q00FPTIgHCcxX_a2nG4I5qYsYo
   Scopes: All (Production, Deploy Previews, Branch deploys)
   ```

5. **Guarda** los cambios

---

## Paso 3: Re-desplegar

Después de añadir las variables de entorno:

1. Ve a **Deploys** en tu sitio de Netlify
2. Click en **"Trigger deploy"**
3. Selecciona **"Clear cache and deploy site"**
4. Espera 1-2 minutos a que termine
5. Visita tu URL de Netlify

Ahora deberías ver la pantalla de **Login/Registro** en lugar del error de configuración.

---

## 🔍 Verificar la Configuración

### Método 1: Netlify Dashboard

1. Ve a **Site settings** → **Environment variables**
2. Verifica que las dos variables estén ahí:
   - ✅ `VITE_SUPABASE_URL`
   - ✅ `VITE_SUPABASE_ANON_KEY`

### Método 2: Build Logs

1. Ve a **Deploys** → Click en el último deploy
2. En los logs, busca:
   ```
   Environment variables set:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
   ```

### Método 3: Consola del Navegador

1. Abre tu sitio de Netlify
2. Abre DevTools (F12) → **Console**
3. **NO** debería aparecer:
   ```
   ❌ ERROR: Variables de entorno de Supabase no configuradas
   ```
4. **Debería** aparecer la pantalla de login

---

## ❌ Problemas Comunes

### Problema 1: Variables no se aplican

**Síntoma**: Añadiste las variables pero sigue mostrando el error

**Solución**:
1. Verifica que las variables tengan los nombres **exactos**:
   - `VITE_SUPABASE_URL` (no `SUPABASE_URL`)
   - `VITE_SUPABASE_ANON_KEY` (no `SUPABASE_ANON_KEY`)
2. **Clear cache and deploy site** (muy importante)
3. Espera 2-3 minutos y recarga con Ctrl+F5

### Problema 2: Error 401 al hacer login

**Síntoma**: La app carga, pero login falla con error 401

**Solución**:
1. Verifica que las variables tengan los **valores correctos**
2. No debe haber espacios al inicio/final de los valores
3. La `VITE_SUPABASE_ANON_KEY` es muy larga, asegúrate de copiarla completa

### Problema 3: Deploy falla

**Síntoma**: El build falla en Netlify

**Solución**:
1. Revisa los **Build logs** en Netlify
2. Busca el error específico
3. Comunes:
   - `npm ERR!` → Problema con dependencias
   - `error TS` → Error de TypeScript
   - `VITE` → Problema con Vite config

### Problema 4: Página en blanco

**Síntoma**: El sitio carga pero está en blanco

**Solución**:
1. Abre DevTools → Console → busca errores en rojo
2. Verifica que la **Publish directory** sea `dist` (no `build`)
3. Verifica que el **Build command** sea `npm run build`

---

## 🔐 Seguridad

### ¿Es seguro poner las claves en Netlify?

✅ **SÍ**, porque:
- `VITE_SUPABASE_ANON_KEY` es la clave **pública** (anon key)
- Está diseñada para ser expuesta en el cliente
- Supabase usa **Row Level Security (RLS)** para proteger los datos
- Solo permite operaciones autorizadas según las políticas RLS

### NO pongas en Netlify:
- ❌ `SUPABASE_SERVICE_ROLE_KEY` (es privada)
- ❌ Contraseñas de base de datos
- ❌ API keys privadas

---

## 📝 Checklist Final

Antes de considerar el deploy completo:

- [ ] Variables de entorno añadidas en Netlify
- [ ] Clear cache and deploy realizado
- [ ] Login/Registro visible en producción
- [ ] Puedes crear una cuenta de prueba
- [ ] Recibes email de verificación
- [ ] Puedes iniciar sesión después de verificar
- [ ] Las facturas se guardan correctamente
- [ ] Las estadísticas funcionan

---

## 🆘 Ayuda Adicional

Si después de seguir todos los pasos aún no funciona:

1. **Revisa TROUBLESHOOTING.md** para errores específicos
2. **Abre un Issue** en GitHub con:
   - Screenshot del error
   - Build logs de Netlify
   - Screenshot de las variables de entorno configuradas
3. **Contacta soporte**: yago@example.com

---

## 📊 URLs Útiles

- **Netlify Dashboard**: https://app.netlify.com
- **Supabase Dashboard**: https://app.supabase.com
- **GitHub Repo**: https://github.com/yagomateos/cejas-automator
- **Documentación Netlify**: https://docs.netlify.com

---

## 🎯 Próximos Pasos

Una vez que la app funcione:

1. **Personaliza el dominio** (Site settings → Domain management)
2. **Configura notificaciones** (Site settings → Build & deploy → Build notifications)
3. **Habilita HTTPS** (debería estar automático)
4. **Añade analytics** (Integrations → Analytics)
