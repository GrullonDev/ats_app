import { Redirect } from 'expo-router';

/**
 * Punto de entrada de la aplicación.
 * Redirige automáticamente al Tab Navigator (Dashboard).
 * La lógica de protección de rutas (Auth) se maneja en el Root Layout (_layout.tsx).
 */
export default function Index() {
  // Simplemente redirigimos al dashboard, RootLayout se encargará de 
  // redirigir a Login si el usuario no tiene sesión.
  return <Redirect href="/(tabs)" />;
}
