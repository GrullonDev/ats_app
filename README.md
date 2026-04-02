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
