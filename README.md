# ATS Mobile - Applicant Tracking System

Aplicación móvil de gestión ATS (Applicant Tracking System) desarrollada con React Native + Expo.

## 📱 Plataformas Soportadas
- Android
- iOS
- Huawei (AppGallery)

## 🚀 Tecnologías
- **React Native** con **Expo SDK 52**
- **TypeScript** para tipado estático
- **Expo Router** para navegación basada en archivos
- **Zustand** para manejo de estado global
- **i18n-js + expo-localization** para internacionalización (ES/EN)
- **React Native MMKV** para almacenamiento local persistente

## 📁 Estructura del Proyecto

```
ats_react_native/
├── app/                    # Rutas y navegación (Expo Router)
│   ├── (tabs)/             # Tab navigation screens
│   ├── _layout.tsx         # Root layout
│   └── index.tsx           # Entry point → WelcomeScreen
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── ui/             # Componentes UI básicos (Button, Card, Badge...)
│   │   └── common/         # Componentes compartidos más complejos
│   ├── screens/            # Pantallas principales
│   │   ├── WelcomeScreen/  # Pantalla de bienvenida/dashboard
│   │   ├── ApplicantsScreen/
│   │   ├── JobsScreen/
│   │   └── ProfileScreen/
│   ├── navigation/         # Configuración adicional de navegación
│   ├── hooks/              # Custom hooks
│   ├── store/              # Estado global (Zustand)
│   │   ├── authStore.ts
│   │   ├── languageStore.ts
│   │   └── atsStore.ts
│   ├── services/           # Llamadas a API / servicios externos
│   │   ├── api.ts
│   │   └── authService.ts
│   ├── i18n/               # Internacionalización
│   │   ├── index.ts
│   │   ├── es.json         # Traducciones en Español
│   │   └── en.json         # Traducciones en Inglés
│   ├── types/              # Tipos TypeScript globales
│   ├── constants/          # Colores, fuentes, tamaños
│   └── utils/              # Funciones utilitarias
├── assets/
│   ├── images/
│   └── fonts/
├── app.json
├── babel.config.js
├── tsconfig.json
└── package.json
```

## 🌐 Internacionalización
La app soporta cambio de idioma entre **Español** e **Inglés** usando `i18n-js`.
El idioma se detecta automáticamente del dispositivo y puede ser cambiado manualmente desde el perfil.

## ⚠️ Notas para Huawei
- No se usa Google Maps (se usará alternativa HMS compatible)
- Push Notifications compatibles con HMS (Huawei Mobile Services)
- Sin dependencias exclusivas de GMS

## 🏃 Cómo ejecutar

```bash
# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo (Expo Go)
npm start

# Ejecutar en una plataforma específica
npm run android
npm run ios
```

## 🔄 Actualización del Proyecto

Para mantener el proyecto al día y resolver problemas de dependencias, puedes usar los siguientes comandos:

```bash
# Limpiar caché de Expo e iniciar (Resuelve la mayoría de problemas de bundling)
npx expo start --clear

# Verificar si hay bibliotecas con versiones incompatibles con Expo SDK
npx expo install --check

# Corregir automáticamente versiones incorrectas según el SDK actual
npx expo install --fix

# Actualizar todas las dependencias (dentro de las versiones compatibles)
npm update
```

## 🤝 Cómo Contribuir

¡Agradecemos tu interés en contribuir a ATS Mobile! Sigue estos pasos para prepararte:

### Requisitos Previos
- **Node.js**: Versión 18 o superior (LTS recomendada).
- **npm**: Gestor de paquetes incluido con Node.
- **Expo Go**: Instalado en tu dispositivo móvil para pruebas rápidas.
- **Android Studio / Xcode**: Opcional, solo si deseas usar emuladores locales.

### Pasos para Empezar
1.  **Fork** el repositorio.
2.  **Clona** tu fork localmente: `git clone https://github.com/GrullonDev/ats_app.git`
3.  Crea una **nueva rama** para tu funcionalidad: `git checkout -b feature/nueva-funcionalidad`
4.  Realiza tus cambios y asegúrate de seguir las reglas de estilo (ESLint).
5.  **Prueba** tus cambios ejecutando el proyecto en un entorno local.
6.  Haz un **Commit** de tus cambios y crea un **Pull Request**.

### Reglas de Desarrollo
- Mantén el código limpio y comentado donde sea necesario.
- Usa **TypeScript** estrictamente para nuevos componentes y servicios.
- Si añades nuevos textos a la UI, recuerda agregarlos tanto en `es.json` como en `en.json`.
- Ejecuta `npm run type-check` antes de subir tus cambios para asegurar que no hay errores de tipado.
