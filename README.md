# ATS Mobile App 🚀

Aplicación móvil multiplataforma para la gestión de procesos de selección (ATS). Diseñada con un enfoque premium y optimizada para la eficiencia en el desarrollo.

## ✨ Características Principales

- **Diseño Moderno:** Interfaz rediseñada inspirada en Figma con modo Navy y tarjetas flotantes.
- **Multilingüe:** Soporte para Inglés (EN) y Español (ES) con selector de idioma dinámico.
- **Métricas:** Panel de control de vacantes, candidatos y entrevistas.
- **Navegación:** Expo Router para un flujo de pestañas fluido.

## 🛠️ Stack Tecnológico

- **Framework:** React Native con Expo (v53).
- **Gestor de Paquetes:** [pnpm](https://pnpm.io/) (Configurado con `node-linker=hoisted`).
- **Estado Global:** Zustand.
- **BBDD Local:** MMKV.

## 📦 Instalación

```bash
<<<<<<< HEAD
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
=======
# Habilitar pnpm si usas Node 20+
corepack enable pnpm

# Instalar dependencias
pnpm install
```

## 🚀 Ejecución y Build

### 🍎 iOS (iPhone)
```bash
pnpm exec expo run:ios -d "iPhone 17"
```

### 🤖 Android (Google Play)
```bash
pnpm exec expo run:android
```

### 📱 Huawei (HarmonyOS / HMS)
Para dispositivos Huawei sin GMS (Google Mobile Services), la aplicación es compatible a través de su base Android:
- **Build APK/AAB:** Usa el comando de build de Android.
- **HMS Core:** Se recomienda el uso de plugins específicos de HMS si se requiere soporte para notificaciones push en Huawei.
- **AppGallery:** Genera el archivo `.aab` para subir a la consola de Huawei.

```bash
# Generar build nativo local para Android/Huawei
pnpm exec expo prebuild --platform android
```

## 🔧 Solución de Problemas (Common Issues)

### iOS
- El `Podfile` incluye un parche para la librería `fmt` (C++).
- Si `AppDelegate.swift` falla tras un prebuild, el import de Expo debe ser `import Expo` (sin `internal`).

### Android
- Asegúrate de tener configurado `JAVA_HOME` apuntando a Java 17.
- Para Huawei, verifica que no haya dependencias estrictas de GMS en módulos críticos de Firebase si planeas publicar en AppGallery.

## 🎨 Diseño Premium

- **Colores:** Navy (`#1A1F36`), Accent Blue (`#4C6FFF`), Stats BG (`#F4F7FE`).
- **Estilo:** Bordes redondeados de `24px` y elevación suave.

---
Desarrollado para **GrullonDev - ATS App**.
>>>>>>> main
