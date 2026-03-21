import { Redirect } from 'expo-router';

/**
 * Punto de entrada de la aplicación.
 * Redirige automáticamente al Tab Navigator (Dashboard).
 * La lógica de protección de rutas (Auth) se maneja en el Root Layout (_layout.tsx).
 */
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
