# Guía de Despliegue - Hansa Project

Esta guía te ayudará a desplegar el backend en Render y el frontend en Vercel.

## 📋 Prerrequisitos

- Cuenta en [Render](https://render.com)
- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas) (recomendado)
- Cuenta en [Cloudinary](https://cloudinary.com) (para subida de archivos)
- Repositorio en GitHub

## 🚀 Paso 1: Desplegar Backend en Render

### 1.1 Preparar el repositorio
1. Sube tu código a GitHub
2. Asegúrate de que el archivo `PR2_Hansa-Backend/package.json` tenga los scripts de build y start

### 1.2 Crear servicio en Render
1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Haz clic en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio que contiene tu proyecto

### 1.3 Configurar el servicio
- **Name**: `hansa-backend` (o el nombre que prefieras)
- **Root Directory**: `PR2_Hansa-Backend`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: `18` (o la versión que uses)

### 1.4 Variables de entorno en Render
En la sección "Environment Variables", agrega:

```
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/hansa?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://tu-frontend.vercel.app
JWT_SECRET=tu_jwt_secret_muy_seguro_y_largo
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion_gmail
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

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
3. Importa tu repositorio de GitHub
4. Selecciona el directorio `PR2_Hansa-Frontend`

### 2.3 Configurar el proyecto
- **Framework Preset**: Vite
- **Root Directory**: `PR2_Hansa-Frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 2.4 Variables de entorno en Vercel
En la sección "Environment Variables", agrega:

```
VITE_API_BASE_URL=https://tu-backend.onrender.com/api
```

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

## 📧 Paso 5: Configurar Email (Opcional)

Si usas verificación por email:
1. Habilita la autenticación de 2 factores en Gmail
2. Genera una contraseña de aplicación
3. Usa esa contraseña en la variable `EMAIL_PASS`

## ☁️ Paso 6: Configurar Cloudinary (Opcional)

Para subida de archivos:
1. Crea una cuenta en [Cloudinary](https://cloudinary.com)
2. Obtén tus credenciales del dashboard
3. Agrega las variables de entorno correspondientes

## 🔍 Verificación

### Backend
- Visita: `https://tu-backend.onrender.com/api/auth/health` (si tienes un endpoint de health)
- Verifica los logs en Render Dashboard

### Frontend
- Visita tu URL de Vercel
- Verifica que las peticiones al backend funcionen
- Revisa la consola del navegador para errores

## 🚨 Solución de Problemas

### Backend no inicia
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs en Render Dashboard
- Asegúrate de que MongoDB esté accesible

### Frontend no se conecta al backend
- Verifica la variable `VITE_API_BASE_URL`
- Revisa la configuración de CORS en el backend
- Verifica que el backend esté funcionando

### Errores de CORS
- Asegúrate de que `FRONTEND_URL` en el backend coincida exactamente con la URL de Vercel
- Incluye el protocolo (https://) en la URL

## 📝 Notas Importantes

1. **Render** tiene un plan gratuito con limitaciones (se duerme después de 15 minutos de inactividad)
2. **Vercel** tiene un plan gratuito generoso para frontends
3. Las variables de entorno son sensibles, no las compartas públicamente
4. Considera usar un dominio personalizado para producción

## 🔗 URLs Finales

- **Backend**: `https://tu-backend.onrender.com`
- **Frontend**: `https://tu-frontend.vercel.app`
- **API Base**: `https://tu-backend.onrender.com/api`

¡Tu aplicación Hansa estará desplegada y funcionando! 🎉
