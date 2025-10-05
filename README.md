# 💼 Procesador de Facturas Profesional

Sistema profesional de gestión de facturas con autenticación, persistencia en la nube y estadísticas avanzadas.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 Características

### ✅ Versión Actual
- 🔐 **Autenticación de usuarios** con Supabase
- ☁️ **Guardado automático** de facturas en la nube
- 📊 **Estadísticas avanzadas** con gráficos interactivos
- 📈 **Dashboard profesional** con KPIs en tiempo real
- 📁 **Importación** desde CSV y Excel
- 📤 **Exportación** a CSV y Excel
- ✏️ **Edición en línea** de facturas
- 🔍 **Búsqueda avanzada** y filtros
- 🌓 **Modo oscuro/claro**
- 📱 **Responsive** - funciona en todos los dispositivos

### 📊 Estadísticas Incluidas
- Evolución de ingresos mensuales (gráfico de área)
- Servicios más vendidos (gráfico de barras)
- Distribución de formas de pago (gráfico circular)
- Ingresos por servicio (gráfico horizontal)
- Top 5 clientes con visitas e ingresos
- Total de ingresos, facturas y ticket promedio

## 🚀 Instalación Rápida

### Prerequisitos
- Node.js 18+
- Cuenta gratuita en [Supabase](https://supabase.com)

### Paso 1: Clonar el proyecto
```bash
git clone https://github.com/yagomateos/cejas-automator.git
cd cejas-automator
npm install
```

### Paso 2: Configurar Supabase

1. **Crear cuenta en Supabase**: https://supabase.com
2. **Crear nuevo proyecto**
3. **Configurar base de datos**:
   - Ve a SQL Editor
   - Ejecuta el script completo que está en `SUPABASE_SETUP.md`

4. **Obtener credenciales**:
   - Ve a Settings → API
   - Copia el `Project URL` y `anon key`

5. **Configurar variables de entorno**:
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### Paso 3: Ejecutar
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:8084/`

## 📖 Uso

### 1. Registro/Login
- Crea una cuenta con tu email
- Ingresa el nombre de tu empresa
- Verifica tu email

### 2. Procesar Facturas
- Arrastra un archivo CSV o Excel
- O haz clic en "Seleccionar archivo"
- Las facturas se procesarán automáticamente

### 3. Guardar en la Nube
- Haz clic en "Guardar en la nube"
- Tus facturas quedarán almacenadas permanentemente
- Accede desde cualquier dispositivo

### 4. Ver Estadísticas
- Ve a la pestaña "Estadísticas"
- Analiza gráficos interactivos
- Identifica tendencias y top clientes

### 5. Exportar
- Exporta a CSV o Excel
- Comparte con tu contador
- Importa en otros sistemas

## 🏗️ Tecnologías

- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Gráficos**: Recharts
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Netlify

## 📁 Estructura del Proyecto

```
cejas-automator/
├── src/
│   ├── components/
│   │   ├── Auth.tsx              # Componente de autenticación
│   │   ├── InvoiceProcessor.tsx  # Procesador principal
│   │   ├── ThemeToggle.tsx       # Selector de tema
│   │   └── ui/                   # Componentes UI
│   ├── contexts/
│   │   └── AuthContext.tsx       # Contexto de autenticación
│   ├── lib/
│   │   ├── supabase.ts           # Cliente de Supabase
│   │   └── utils.ts              # Utilidades
│   └── pages/
│       ├── Index.tsx             # Página principal
│       └── NotFound.tsx          # Página 404
├── .env.example                   # Variables de entorno ejemplo
├── SUPABASE_SETUP.md             # Guía de configuración Supabase
├── netlify.toml                  # Configuración Netlify
└── README.md                     # Este archivo
```

## 🔒 Seguridad

- ✅ Row Level Security (RLS) en Supabase
- ✅ Autenticación segura con JWT
- ✅ Variables de entorno para credenciales
- ✅ HTTPS obligatorio en producción
- ✅ Datos encriptados en tránsito y reposo

## 📈 Roadmap

### Próximas funcionalidades
- [ ] Generación de PDF de facturas
- [ ] Gestión de clientes completa
- [ ] Envío de facturas por email
- [ ] Exportación para Hacienda
- [ ] Plantillas personalizables
- [ ] Multi-empresa
- [ ] Recordatorios de pago
- [ ] Integración con Stripe
- [ ] App móvil (React Native)

## 🎯 Casos de Uso

### Para Autónomos
- Gestiona tus facturas profesionalmente
- Cumple con normativas fiscales
- Ahorra tiempo en administración

### Para Pequeñas Empresas
- Centraliza la facturación
- Control total de ingresos
- Reportes para contabilidad

### Para RR.HH.
- Gestión de nóminas y pagos
- Seguimiento de gastos
- Reportes de departamento

## 💰 Modelo de Negocio (Futuro)

### Plan Gratuito
- Hasta 10 facturas/mes
- 1 usuario
- Características básicas

### Plan Básico - €9.99/mes
- 100 facturas/mes
- 1 usuario
- Todas las características

### Plan Pro - €29.99/mes
- Facturas ilimitadas
- 5 usuarios
- Soporte prioritario
- Exportación PDF
- Plantillas personalizadas

### Plan Empresa - €99/mes
- Todo ilimitado
- Multi-empresa
- API access
- Soporte dedicado

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👤 Autor

**Yago Mateos**
- GitHub: [@yagomateos](https://github.com/yagomateos)
- Proyecto: [cejas-automator](https://github.com/yagomateos/cejas-automator)

## 🙏 Agradecimientos

- [Supabase](https://supabase.com) - Backend as a Service
- [shadcn/ui](https://ui.shadcn.com) - Componentes UI
- [Recharts](https://recharts.org) - Librería de gráficos
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS

---

⭐ Si este proyecto te ayuda, considera darle una estrella en GitHub!
