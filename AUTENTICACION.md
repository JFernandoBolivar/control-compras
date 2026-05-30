# Sistema de Autenticación - Control Interno de Compras

## Descripción General

Se ha implementado un sistema de autenticación completo para el Sistema de Control Interno de Compras. El sistema utiliza localStorage del navegador para persistir las sesiones de usuarios autenticados, garantizando que siempre se redirige automáticamente al dashboard cuando hay sesión activa.

## Características Principales

### 1. Login y Autenticación
- Página de login moderna y amigable
- Validación de credenciales (usuario y contraseña)
- Tres roles predefinidos con credenciales de demostración:
  - **admin** / **admin** - Administrador
  - **user** / **user** - Usuario Regular
  - **gerente** / **gerente** - Gerente de Compras

### 2. Gestión de Sesiones
- Sesiones almacenadas en localStorage del navegador
- Persistencia automática de la sesión entre recargas
- Recuperación de sesión al iniciar la aplicación
- Logout que limpia completamente la sesión

### 3. Comportamiento de Redirección
- **Sin sesión activa**: Redirige automáticamente a la página de login
- **Con sesión activa**: Redirige automáticamente al dashboard
- **Durante carga**: Muestra un spinner de carga mientras se verifica la sesión

### 4. Header Personalizado
- Muestra el nombre y rol del usuario autenticado
- Botón de "Cerrar Sesión" (logout) en rojo
- Información del usuario en la esquina superior derecha
- Responde adaptivamente en dispositivos móviles

## Archivos Implementados

```
context/
  └─ auth-context.tsx         # Contexto de autenticación con hooks

components/
  └─ login-view.tsx           # Componente de página de login

app/
  └─ page.tsx                 # Página principal con lógica de autenticación
  └─ layout.tsx               # Layout con AuthProvider envuelto
```

## Flujo de Autenticación

```
1. Usuario accede a http://localhost:3000
   ↓
2. AuthProvider verifica localStorage
   ↓
3. Si NO hay sesión válida
   └→ Mostrar LoginView
   ↓
4. Si SÍ hay sesión válida
   └→ Redirigir al Dashboard
   ↓
5. Usuario ingresa credenciales
   ↓
6. Validación exitosa
   └→ Guardar sesión en localStorage
   └→ Redirigir al Dashboard
   ↓
7. Usuario en Dashboard
   └→ Puede acceder a todos los módulos
   └→ Botón "Cerrar Sesión" disponible
   ↓
8. Usuario hace logout
   └→ Limpiar localStorage
   └→ Redirigir a LoginView
```

## Credenciales de Demostración

### Administrador
- **Usuario:** admin
- **Contraseña:** admin
- **Rol:** Admin
- **Acceso:** Todas las funcionalidades

### Usuario Regular
- **Usuario:** user
- **Contraseña:** user
- **Rol:** Usuario Regular
- **Acceso:** Funcionalidades estándar

### Gerente de Compras
- **Usuario:** gerente
- **Contraseña:** gerente
- **Rol:** Gerente de Compras
- **Acceso:** Funcionalidades de gerencia

## Estructura del Contexto de Autenticación

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'gerente';
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}
```

## Uso del Hook useAuth

En cualquier componente puedes acceder a la autenticación usando:

```typescript
import { useAuth } from '@/context/auth-context';

export default function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>Bienvenido {user?.name}</p>}
    </div>
  );
}
```

## Datos Almacenados

En localStorage se guarda:
```json
{
  "auth_user": {
    "id": "1",
    "username": "admin",
    "email": "admin@techsolutions.com",
    "role": "admin",
    "name": "Administrador"
  }
}
```

## Características de Seguridad

- Almacenamiento de credenciales solo en navegador (desarrollo)
- Limpieza completa de sesión al logout
- Validación de credenciales al login
- Manejo de errores con mensajes claros
- No se almacenan contraseñas en localStorage

## Comportamiento Automático

✅ **Siempre redirige al dashboard** cuando hay sesión activa
✅ **Siempre redirige al login** cuando no hay sesión
✅ **Mantiene la sesión** entre recargas de página
✅ **Limpia la sesión** al hacer logout
✅ **Verifica estado** mientras carga

## Testing

Para probar el sistema:

1. Accede a http://localhost:3000
2. Verás la página de login
3. Usa cualquiera de las credenciales de demostración
4. Serás redirigido automáticamente al dashboard
5. Verás tu nombre y rol en la esquina superior derecha
6. Haz clic en "Cerrar Sesión"
7. Serás redirigido automáticamente al login
8. Recarga la página sin iniciar sesión - seguirás en el login
9. Inicia sesión nuevamente - la sesión se mantendrá entre recargas

## Notas Importantes

- Este es un sistema de demostración con credenciales simuladas
- Para producción, implementar backend real con JWT o similar
- Las contraseñas no se encriptan (solo demostración)
- localStorage es específico del navegador y dominio
- Al limpiar datos del navegador, se pierde la sesión

## Próximas Mejoras Sugeridas

- Integración con backend de autenticación real
- JWT tokens para sesiones más seguras
- Encriptación de contraseñas
- Recuperación de contraseña
- Autenticación multi-factor (2FA)
- OAuth / Social Login
- Rate limiting en intentos de login
