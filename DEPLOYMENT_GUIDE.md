# Guía de Despliegue - Hansa Project

Esta guía te ayudará a desplegar el backend en Render y el frontend en Vercel.

## 🌿 Rama de Despliegue

Este proyecto utiliza una rama dedicada para despliegue:
- **Rama principal**: `main` - Desarrollo y cambios activos
- **Rama de despliegue**: `deploy` - Versión estable para producción

**Importante**: Todos los despliegues deben hacerse desde la rama `deploy` para evitar problemas de incompatibilidad.

## 📋 Prerrequisitos

- Cuenta en [Render](https://render.com)
- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas) (recomendado)
- Cuenta en [Cloudinary](https://cloudinary.com) (para subida de archivos de imagen)
- Cuenta en [Brevo](https://www.brevo.com) (anteriormente Sendinblue, para envío de emails)
- Repositorio en GitHub

## 🚀 Paso 1: Desplegar Backend en Render

### 1.1 Preparar el repositorio
1. Asegúrate de estar en la rama `deploy`:
   ```bash
   git checkout deploy
   git pull origin deploy
   ```
2. Verifica que el archivo `PR2_Hansa-Backend/package.json` tenga los scripts de build y start
3. **IMPORTANTE**: Nunca subas archivos `.env.production` al repositorio. Usa solo `env.example` como referencia

### 1.2 Crear servicio en Render
1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Haz clic en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio `PS3-HANSA-M2`
5. **Importante**: Selecciona la rama `deploy` en la configuración

### 1.3 Configurar el servicio
- **Name**: `hansa-backend` (o el nombre que prefieras)
- **Root Directory**: `PR2_Hansa-Backend`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: `18` (o la versión que uses)

### 1.4 Variables de entorno en Render
En la sección "Environment Variables", agrega las siguientes variables (basadas en `PR2_Hansa-Backend/env.example`):

```
# Server
PORT=10000
NODE_ENV=production

# Database - MongoDB Atlas
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/hansa?retryWrites=true&w=majority

# JWT Secret - Usa un valor largo y seguro
JWT_SECRET=tu_jwt_secret_muy_seguro_y_largo_minimo_32_caracteres

# Brevo Email Service (anteriormente Sendinblue)
BREVO_API_KEY=tu_brevo_api_key_aqui
BREVO_FROM_EMAIL=tu_email@ejemplo.com
BREVO_FROM_NAME=Univalle - Plataforma Educativa

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=tu_cloudinary_cloud_name
CLOUDINARY_API_KEY=tu_cloudinary_api_key
CLOUDINARY_API_SECRET=tu_cloudinary_api_secret

# App Configuration
APP_NAME=Plataforma Estudiantes
FRONTEND_URL=https://tu-frontend.vercel.app
RESET_TOKEN_TTL_MIN=20

# Rate limit de reenvío del 2FA
RESEND_WINDOW_SEC=600
RESEND_MAX_PER_WINDOW=3
RESEND_MIN_INTERVAL_SEC=60
TWOFA_TTL_MIN=5
```

**Notas importantes:**
- Obtén tu `BREVO_API_KEY` desde el [Dashboard de Brevo](https://app.brevo.com/settings/keys/api)
- El `JWT_SECRET` debe ser una cadena aleatoria y segura de al menos 32 caracteres
- La `MONGO_URI` debe incluir el nombre de tu base de datos
- Actualiza `FRONTEND_URL` con la URL real de Vercel después del despliegue del frontend

### 1.5 Desplegar
1. Haz clic en "Create Web Service"
2. Render comenzará a construir y desplegar tu aplicación
3. Una vez completado, obtendrás una URL como: `https://hansa-backend.onrender.com`

## 🌐 Paso 2: Desplegar Frontend en Vercel

### 2.1 Preparar el repositorio
1. Asegúrate de que el archivo `PR2_Hansa-Frontend/vercel.json` esté presente
2. El archivo `env.example` debe contener las variables necesarias

### 2.2 Conectar con Vercel
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en "New Project"
3. Importa tu repositorio de GitHub `PS3-HANSA-M2`
4. **Importante**: Configura para usar la rama `deploy`
5. Selecciona el directorio `PR2_Hansa-Frontend`

### 2.3 Configurar el proyecto
- **Framework Preset**: Vite
- **Root Directory**: `PR2_Hansa-Frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 2.4 Variables de entorno en Vercel
En la sección "Environment Variables", agrega:

```
VITE_API_BASE_URL=https://tu-backend.onrender.com
```

**Nota**: No incluyas `/api` al final de la URL, ya que el frontend lo agrega automáticamente en las peticiones.

### 2.5 Desplegar
1. Haz clic en "Deploy"
2. Vercel construirá y desplegará tu aplicación
3. Una vez completado, obtendrás una URL como: `https://hansa-frontend.vercel.app`

## 🔄 Paso 3: Actualizar URLs

### 3.1 Actualizar CORS en Backend
Una vez que tengas la URL del frontend, actualiza la variable `FRONTEND_URL` en Render con la URL real de Vercel.

### 3.2 Actualizar API URL en Frontend
Actualiza la variable `VITE_API_BASE_URL` en Vercel con la URL real de tu backend en Render.

## 🗄️ Paso 4: Configurar Base de Datos

### 4.1 MongoDB Atlas (Recomendado)
1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea un nuevo cluster
3. Crea un usuario de base de datos
4. Obtén la cadena de conexión
5. Agrega la IP de Render a la whitelist (0.0.0.0/0 para permitir todas las IPs)

### 4.2 Cadena de conexión
```
mongodb+srv://usuario:password@cluster.mongodb.net/hansa?retryWrites=true&w=majority
```

## 📧 Paso 5: Configurar Brevo (Email Service)

El proyecto utiliza [Brevo](https://www.brevo.com) (anteriormente Sendinblue) para el envío de emails:

### 5.1 Crear cuenta en Brevo
1. Regístrate en [Brevo](https://www.brevo.com)
2. Verifica tu cuenta de email
3. Completa la configuración inicial

### 5.2 Obtener API Key
1. Ve a [Settings → API Keys](https://app.brevo.com/settings/keys/api)
2. Crea una nueva API Key (v3)
3. Copia la key y agrégala a las variables de entorno como `BREVO_API_KEY`

### 5.3 Verificar dominio de envío
1. Configura el email desde el cual se enviarán los correos
2. Verifica el dominio si es necesario
3. Usa ese email en la variable `BREVO_FROM_EMAIL`

### 5.4 Funcionalidades de email
El sistema envía emails para:
- Verificación de cuenta (código 2FA)
- Recuperación de contraseña
- Notificaciones de invitaciones a repositorios
- Notificaciones de aplicaciones

## ☁️ Paso 6: Configurar Cloudinary

Para subida y gestión de archivos de imagen:

### 6.1 Crear cuenta
1. Crea una cuenta en [Cloudinary](https://cloudinary.com)
2. Verifica tu email

### 6.2 Obtener credenciales
1. Ve al Dashboard de Cloudinary
2. Encontrarás las siguientes credenciales:
   - **Cloud Name**: Tu nombre de cloud único
   - **API Key**: Tu clave de API
   - **API Secret**: Tu secreto de API

### 6.3 Configurar variables
Agrega estas credenciales a las variables de entorno:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### 6.4 Uso en el proyecto
Cloudinary se usa para:
- Fotos de perfil de usuarios
- Imágenes de repositorios
- Cualquier contenido multimedia subido por usuarios

## 🔍 Verificación

### Backend
- Visita: `https://tu-backend.onrender.com/` (debería mostrar un mensaje de API funcionando)
- Prueba el endpoint de salud: `https://tu-backend.onrender.com/api/health` (si está implementado)
- Verifica los logs en Render Dashboard
- Prueba el login/registro desde el frontend

### Frontend
- Visita tu URL de Vercel
- Verifica que las peticiones al backend funcionen
- Revisa la consola del navegador para errores
- Prueba las siguientes funcionalidades:
  - Registro de usuario con código 2FA
  - Login
  - Creación de repositorios
  - Subida de archivos
  - Invitaciones a repositorios

## 🚨 Solución de Problemas

### Error de compilación TypeScript en Render
Si ves errores como "Could not find a declaration file for module 'express'":
- **Solución**: Las dependencias `@types/*` y `typescript` deben estar en `dependencies`, no en `devDependencies`
- **Ya solucionado**: El `package.json` ya está configurado correctamente

### Backend no inicia
- Verifica que todas las variables de entorno estén configuradas correctamente
- Revisa los logs en Render Dashboard
- Asegúrate de que MongoDB esté accesible y la URI sea correcta
- Verifica que estás usando la rama `deploy`

### Frontend no se conecta al backend
- Verifica la variable `VITE_API_BASE_URL` (sin `/api` al final)
- Revisa la configuración de CORS en el backend
- Verifica que el backend esté funcionando
- Comprueba la consola del navegador para ver el error exacto

### Errores de CORS
- Asegúrate de que `FRONTEND_URL` en el backend coincida exactamente con la URL de Vercel
- Incluye el protocolo (https://) en la URL
- No incluyas barra final en la URL

### Emails no se envían
- Verifica que `BREVO_API_KEY` sea válida
- Comprueba que el email en `BREVO_FROM_EMAIL` esté verificado en Brevo
- Revisa los logs del backend para ver errores específicos
- Verifica que no hayas excedido el límite gratuito de Brevo

### Errores de subida de archivos
- Verifica las credenciales de Cloudinary
- Asegúrate de que el tamaño del archivo no exceda los límites
- Revisa los logs para errores específicos
- Comprueba que la configuración de Cloudinary permita el tipo de archivo

### Render: Service sleeps (plan gratuito)
- El servicio gratuito de Render se duerme después de 15 minutos de inactividad
- La primera petición después de dormir puede tardar 30-50 segundos
- Considera usar un servicio de ping o actualizar a un plan pago para producción

### Error: "Push protection" al hacer git push
- **Causa**: Intentaste subir archivos `.env.production` u otros archivos con secretos
- **Solución**: 
  1. Elimina los archivos sensibles del commit
  2. Usa `git rm --cached archivo.env`
  3. Agrega los archivos al `.gitignore`
  4. Haz commit de nuevo y push

## 📝 Notas Importantes

### Seguridad
1. **NUNCA** subas archivos `.env` o `.env.production` al repositorio
2. Usa archivos `env.example` solo con valores de ejemplo, no reales
3. Mantén tus API keys y secretos seguros
4. Usa variables de entorno diferentes para desarrollo y producción
5. Cambia todas las claves y secretos antes de ir a producción

### Planes gratuitos
1. **Render**: Plan gratuito con limitaciones (se duerme después de 15 minutos de inactividad)
2. **Vercel**: Plan gratuito generoso para frontends
3. **MongoDB Atlas**: Hasta 512MB gratis
4. **Cloudinary**: Plan gratuito con límites de almacenamiento y transformaciones
5. **Brevo**: Plan gratuito con límite de 300 emails/día

### Mejores prácticas
1. Usa la rama `deploy` para despliegues en producción
2. Prueba todos los cambios en `main` antes de mergear a `deploy`
3. Mantén actualizadas las dependencias
4. Monitorea los logs regularmente
5. Configura alertas en Render y Vercel
6. Considera usar un dominio personalizado para producción
7. Implementa rate limiting para prevenir abuso
8. Configura backups regulares de la base de datos

### Estructura del proyecto
```
PS3-HANSA-M2/
├── PR2_Hansa-Backend/     # API Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/        # Configuraciones (DB, Cloudinary, CORS, etc.)
│   │   ├── controllers/   # Lógica de negocio
│   │   ├── models/        # Modelos de MongoDB (Mongoose)
│   │   ├── routes/        # Rutas de la API
│   │   ├── middleware/    # Auth, rate limiting, etc.
│   │   ├── services/      # Servicios (email, etc.)
│   │   └── utils/         # Utilidades
│   └── package.json
│
└── PR2_Hansa-Frontend/    # React + TypeScript + Vite
    ├── src/
    │   ├── features/      # Módulos por funcionalidad
    │   ├── pages/         # Páginas de la aplicación
    │   ├── components/    # Componentes reutilizables
    │   ├── services/      # Llamadas a la API
    │   └── context/       # Context API para estado global
    └── package.json
```

## 🔗 URLs y Recursos Finales

### URLs de despliegue
- **Backend**: `https://hansa-backend.onrender.com`
- **Frontend**: `https://hansa-frontend.vercel.app`
- **API Base**: `https://hansa-backend.onrender.com/api`

### Recursos externos
- [Render Dashboard](https://dashboard.render.com)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [MongoDB Atlas](https://cloud.mongodb.com)
- [Cloudinary Dashboard](https://console.cloudinary.com)
- [Brevo Dashboard](https://app.brevo.com)

### Repositorio
- **GitHub**: `https://github.com/CB-PROYECTO-SISTEMAS-2025/PS3-HANSA-M2`
- **Rama principal**: `main`
- **Rama de producción**: `deploy`

## 🔄 Actualizar Despliegue

Cuando necesites actualizar la aplicación desplegada:

### Actualizar Backend
1. Haz los cambios en la rama `main`
2. Prueba los cambios localmente
3. Merge a la rama `deploy`:
   ```bash
   git checkout deploy
   git merge main
   git push origin deploy
   ```
4. Render detectará automáticamente los cambios y redesplegará

### Actualizar Frontend
1. Haz los cambios en la rama `main`
2. Prueba los cambios localmente
3. Merge a la rama `deploy`:
   ```bash
   git checkout deploy
   git merge main
   git push origin deploy
   ```
4. Vercel detectará automáticamente los cambios y redesplegará

### Rollback en caso de error
Si algo sale mal:
```bash
git checkout deploy
git reset --hard HEAD~1  # Volver al commit anterior
git push origin deploy --force
```

¡Tu aplicación Hansa estará desplegada y funcionando! 🎉
