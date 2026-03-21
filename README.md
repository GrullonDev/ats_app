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
npm install
npm start          # Expo Dev Tools
npm run android    # Android
npm run ios        # iOS
```
