# 💼 Procesador de Facturas Profesional

Sistema profesional de gestión de facturas con autenticación, persistencia en la nube y estadísticas avanzadas.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Enabled-3ECF8E?logo=supabase)

## ✨ Demo en Vivo

🔗 **[Ver Demo](https://tu-app.netlify.app)** *(Próximamente)*

## 📸 Screenshots

<div align="center">

### Dashboard Principal
![Dashboard](docs/screenshots/dashboard.png)

### Vista de Facturas Agrupadas
![Facturas](docs/screenshots/invoices.png)

### Estadísticas Avanzadas
![Stats](docs/screenshots/stats.png)

</div>

## 🌟 Características

### ✅ Versión Actual (v2.0)

#### 💾 Gestión de Facturas
- 📁 **Importación múltiple** desde CSV y Excel
- 📋 **Vista agrupada por mes/año** con acordeones desplegables
- 🔢 **Numeración automática** incremental
- ✏️ **Edición en línea** de cualquier campo
- 🗑️ **Borrado individual** de facturas
- 💾 **Sistema de guardado acumulativo** - cada carga se suma a las anteriores
- 🔄 **Sincronización en tiempo real** con la nube

#### 🔐 Autenticación y Seguridad
- 🔒 **Autenticación segura** con Supabase
- 👤 **Perfiles de usuario** personalizados
- 🔑 **Row Level Security (RLS)** activado
- 🛡️ **Datos encriptados** en tránsito y reposo

#### 📊 Estadísticas y Análisis
- 📈 **Evolución mensual** de ingresos (gráfico de área)
- 📊 **Servicios más vendidos** (gráfico de barras)
- 🥧 **Distribución de formas de pago** (gráfico circular)
- 💰 **Ingresos por servicio** (gráfico horizontal)
- 👥 **Top 5 clientes** con visitas e ingresos
- 📉 **KPIs en tiempo real**: Total ingresos, facturas, ticket promedio

#### 🎨 Interfaz y UX
- 🌓 **Modo oscuro/claro** con preferencia guardada
- 📱 **100% Responsive** - móvil, tablet y escritorio
- 🎯 **Drag & Drop** para subir archivos
- 🔍 **Búsqueda instantánea** con filtros
- 📤 **Exportación** a CSV y Excel
- ⚡ **Hot Module Replacement** para desarrollo rápido

## 🚀 Instalación Rápida

### Prerequisitos
- Node.js 18+ ([Descargar](https://nodejs.org))
- npm o yarn
- Cuenta gratuita en [Supabase](https://supabase.com)

### Paso 1: Clonar e instalar

```bash
# Clonar repositorio
git clone https://github.com/yagomateos/cejas-automator.git
cd cejas-automator

# Instalar dependencias
npm install
```

### Paso 2: Configurar Supabase

#### 2.1 Crear proyecto en Supabase
1. Ve a [Supabase](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que se inicialice (1-2 minutos)

#### 2.2 Configurar base de datos
1. Ve a **SQL Editor** en el panel de Supabase
2. Abre el archivo [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)
3. Copia y ejecuta todo el script SQL

#### 2.3 Obtener credenciales
1. Ve a **Settings** → **API**
2. Copia:
   - `Project URL` → será tu `VITE_SUPABASE_URL`
   - `anon public` key → será tu `VITE_SUPABASE_ANON_KEY`

#### 2.4 Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### Paso 3: Ejecutar

```bash
# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

La aplicación estará en `http://localhost:8080/` 🚀

## 📖 Guía de Uso

### 1️⃣ Registro y Login

1. **Crear cuenta**
   - Ingresa tu email y contraseña
   - Verifica tu email (revisa spam)
   - Completa tu perfil empresarial

2. **Datos del perfil**
   - Nombre de empresa
   - CIF/NIF
   - Dirección
   - Teléfono
   - Logo (próximamente)

### 2️⃣ Procesar Facturas

#### Métodos de carga:
- 🖱️ **Drag & Drop**: Arrastra tu archivo CSV/Excel
- 📁 **Selector**: Haz clic en "Seleccionar archivo"

#### Formatos soportados:
- ✅ CSV (UTF-8)
- ✅ Excel (.xlsx, .xls)

#### Estructura esperada:
```csv
Fecha,Concepto,Importe con IVA,Precio sin IVA,Número,Forma de Pago,Cliente
01/08/2025,Diseño de cejas,€20.00,€16.53,FAC-001,Transferencia,María García
```

### 3️⃣ Guardar en la Nube

1. **Facturas pendientes**
   - Al subir un archivo, verás un aviso amarillo
   - Las facturas están en modo "pendiente"

2. **Guardar**
   - Haz clic en "Guardar X" (esquina superior)
   - Se añaden a las facturas existentes
   - Se acumulan automáticamente

3. **Descartar**
   - Botón "Descartar" para eliminar pendientes
   - No afecta a las facturas ya guardadas

### 4️⃣ Gestionar Facturas

#### Vista de Lista (Recomendada)
- 📅 **Agrupadas por mes/año**
- ▶️ **Acordeones desplegables**
- 👁️ **Ver detalle** con un clic
- 🗑️ **Borrar individual** al hacer hover

#### Vista de Tabla
- 📊 **Vista completa** en tabla
- 🔍 **Búsqueda** por cualquier campo
- ✏️ **Edición directa** de celdas
- 📤 **Exportar** CSV/Excel

### 5️⃣ Ver Estadísticas

Pestaña **Estadísticas** incluye:

- 📈 **Evolución Mensual**: Gráfico de área con tendencia
- 📊 **Servicios Top**: Qué se vende más
- 🥧 **Métodos de Pago**: Distribución porcentual
- 💰 **Ingresos/Servicio**: Comparativa horizontal
- 👥 **Top Clientes**: Los 5 mejores con visitas e ingresos

## 🏗️ Tecnologías

### Frontend
- ⚛️ **React 18.3** - Librería UI
- 📘 **TypeScript 5.6** - Tipado estático
- ⚡ **Vite 5.4** - Build tool ultra rápido
- 🎨 **Tailwind CSS 3.4** - Estilos utility-first
- 🧩 **shadcn/ui** - Componentes accesibles

### Gráficos y Visualización
- 📊 **Recharts** - Gráficos interactivos
- 🎭 **Lucide Icons** - Iconografía moderna
- 🌈 **Radix UI** - Primitivos accesibles

### Backend y Base de Datos
- 🔥 **Supabase** - Backend as a Service
  - PostgreSQL (base de datos)
  - Auth (autenticación)
  - Row Level Security
  - Real-time subscriptions
- 📦 **XLSX** - Procesamiento Excel

### DevOps
- 🚀 **Netlify** - Despliegue continuo
- 🔄 **Git** - Control de versiones
- 📦 **npm** - Gestión de paquetes

## 📁 Estructura del Proyecto

```
cejas-automator/
├── 📂 src/
│   ├── 📂 components/
│   │   ├── 🔐 Auth.tsx                    # Login/Registro
│   │   ├── 📋 InvoiceProcessor.tsx        # Procesador principal
│   │   ├── 📊 InvoiceList.tsx             # Vista agrupada
│   │   ├── 🌓 ThemeToggle.tsx             # Selector tema
│   │   └── 📂 ui/                         # shadcn components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── tabs.tsx
│   │       └── ...
│   ├── 📂 contexts/
│   │   └── 👤 AuthContext.tsx             # Estado de autenticación
│   ├── 📂 lib/
│   │   ├── 🔥 supabase.ts                 # Cliente Supabase
│   │   └── 🛠️ utils.ts                    # Utilidades
│   ├── 📂 pages/
│   │   ├── 🏠 Index.tsx                   # Página principal
│   │   └── ❌ NotFound.tsx                # 404
│   ├── 🎨 index.css                        # Estilos globales
│   └── 📄 main.tsx                         # Entry point
├── 📂 public/                              # Assets estáticos
├── 📄 .env.example                         # Plantilla variables
├── 📄 SUPABASE_SETUP.md                   # Guía SQL completa
├── 📄 NEXT_STEPS.md                       # Roadmap
├── 📄 netlify.toml                        # Config deployment
├── 📄 package.json                        # Dependencias
├── 📄 tsconfig.json                       # Config TypeScript
├── 📄 tailwind.config.ts                  # Config Tailwind
└── 📄 README.md                           # Este archivo
```

## 🔒 Seguridad

### Implementado
- ✅ **Row Level Security (RLS)** en todas las tablas
- ✅ **Autenticación JWT** con Supabase Auth
- ✅ **Variables de entorno** para credenciales
- ✅ **HTTPS obligatorio** en producción
- ✅ **Encriptación** end-to-end
- ✅ **Políticas de acceso** por usuario

### Políticas RLS Activas
```sql
-- Solo el propietario puede ver sus facturas
CREATE POLICY "Users can view own invoices"
ON facturas FOR SELECT
USING (auth.uid() = user_id);

-- Solo el propietario puede crear sus facturas
CREATE POLICY "Users can insert own invoices"
ON facturas FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Solo el propietario puede actualizar sus facturas
CREATE POLICY "Users can update own invoices"
ON facturas FOR UPDATE
USING (auth.uid() = user_id);

-- Solo el propietario puede borrar sus facturas
CREATE POLICY "Users can delete own invoices"
ON facturas FOR DELETE
USING (auth.uid() = user_id);
```

## 📈 Roadmap

### 🎯 v2.1 - En Desarrollo
- [ ] Generación de PDF profesionales
- [ ] Envío de facturas por email
- [ ] Plantillas personalizables
- [ ] Logo de empresa en facturas

### 🚀 v2.2 - Planificado
- [ ] Gestión completa de clientes
- [ ] Catálogo de servicios/productos
- [ ] Recordatorios de pago automáticos
- [ ] Exportación para Hacienda (modelo 303)

### 💫 v3.0 - Futuro
- [ ] Multi-empresa
- [ ] Roles y permisos
- [ ] API REST pública
- [ ] Webhooks
- [ ] Integración Stripe/PayPal
- [ ] App móvil (React Native)
- [ ] Modo offline

## 💰 Modelo de Negocio (Planificado)

| Plan | Precio | Facturas | Usuarios | Características |
|------|--------|----------|----------|-----------------|
| **Gratuito** | €0 | 10/mes | 1 | Básicas |
| **Básico** | €9.99/mes | 100/mes | 1 | Todas + PDF |
| **Pro** | €29.99/mes | Ilimitadas | 5 | Todas + Plantillas + Soporte |
| **Empresa** | €99/mes | Ilimitadas | Ilimitados | Todo + API + Soporte dedicado |

## 🎯 Casos de Uso

### 👨‍💼 Para Autónomos
- ✅ Gestiona facturas profesionalmente
- ✅ Cumple normativas fiscales
- ✅ Ahorra tiempo en administración

### 🏢 Para Pequeñas Empresas
- ✅ Centraliza la facturación
- ✅ Control total de ingresos
- ✅ Reportes para contabilidad

### 💼 Para Freelancers
- ✅ Tracking de proyectos
- ✅ Seguimiento de cobros
- ✅ Estadísticas de rendimiento

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! 🎉

### Proceso
1. **Fork** el proyecto
2. **Crea** una rama feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add: Amazing feature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### Guías
- 📝 Sigue la [Guía de Estilo](CONTRIBUTING.md)
- ✅ Asegúrate que los tests pasen
- 📖 Actualiza la documentación
- 🐛 Reporta bugs con detalle

## 🐛 Reportar Bugs

Abre un [Issue](https://github.com/yagomateos/cejas-automator/issues) incluyendo:
- 📝 Descripción del problema
- 🔄 Pasos para reproducir
- 💻 Tu entorno (OS, navegador, versión)
- 📸 Screenshots si es posible

## 📝 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver [LICENSE](LICENSE) para más información.

## 👤 Autor

**Yago Mateos**
- 💼 GitHub: [@yagomateos](https://github.com/yagomateos)
- 📧 Email: yago@example.com
- 🌐 Portfolio: [yagomateos.dev](https://yagomateos.dev)

## 🙏 Agradecimientos

- [Supabase](https://supabase.com) - Backend increíble
- [shadcn/ui](https://ui.shadcn.com) - Componentes hermosos
- [Recharts](https://recharts.org) - Gráficos potentes
- [Tailwind CSS](https://tailwindcss.com) - CSS utility-first
- [Vite](https://vitejs.dev) - Build tool velocísimo

## 📊 Estado del Proyecto

![GitHub stars](https://img.shields.io/github/stars/yagomateos/cejas-automator?style=social)
![GitHub forks](https://img.shields.io/github/forks/yagomateos/cejas-automator?style=social)
![GitHub issues](https://img.shields.io/github/issues/yagomateos/cejas-automator)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yagomateos/cejas-automator)

---

<div align="center">

### ⭐ Si este proyecto te ayuda, considera darle una estrella!

**Hecho con ❤️ y ☕ por [Yago Mateos](https://github.com/yagomateos)**

[⬆️ Volver arriba](#-procesador-de-facturas-profesional)

</div>
