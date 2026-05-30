# 📋 Nuevas Funcionalidades: Gestión de Documentos y Vigencias

## Descripción General

Se han añadido dos nuevos módulos complementarios al Sistema de Control Interno que permiten:

1. **Gestión de Documentos del Expediente** - Carga y organización de documentos esenciales
2. **Monitoreo de Requisitos y Vigencias** - Seguimiento de fechas de vencimiento

Ambos módulos utilizan **localStorage** del navegador para guardar datos en memoria, lo que significa que los datos persisten entre sesiones sin necesidad de backend.

---

## 1. Módulo de Documentos del Expediente

### ¿Qué hace?
Permite cargar y organizar los documentos esenciales de cada expediente de forma categorizada.

### Documentos Soportados
- ✅ **Oficio de Requisición** - Del área usuaria solicitante
- ✅ **Presupuesto del Proveedor** - Cotización o presupuesto ganador
- ✅ **Orden de Compra/Servicio** - Documento oficial de la orden
- ✅ **Nota de Entrega** - Comprobante de recepción
- ✅ **Acta de Recepción/Conformidad** - Conformidad de buena ejecución
- ✅ **Otros Documentos** - Cualquier otro documento relevante

### Características
- 📁 Carga rápida de archivos (simulada)
- 📊 Barra de progreso visual (4 documentos esenciales)
- 🗑️ Eliminación individual de documentos
- 📅 Fechas de carga automáticas
- 🎯 Indica cuáles documentos están completos

### Ubicación
```
Navegación → Documentos (nuevo tab)
    ↓
Selecciona expediente
    ↓
Pestaña "Documentos"
```

---

## 2. Módulo de Requisitos y Vigencias

### ¿Qué hace?
Monitorea y gestiona fechas de vencimiento de requisitos como RIF, RUC, certificaciones, registros, etc.

### Categorías de Requisitos
- 📋 **RUC** - Registro Único de Contribuyentes
- 📋 **RIF** - Registro Federal de Impuestos
- 📋 **Certificación Bancaria** - Datos bancarios del proveedor
- 📋 **Registro Nacional de Contrataciones (RNC)**
- 📋 **Otros Requisitos** - Licencias, permisos, etc.

### Estados Automáticos
El sistema detecta automáticamente el estado basándose en días restantes:

| Estado | Condición | Color |
|--------|-----------|-------|
| ✅ **Vigente** | Más de 15 días | Verde |
| ⚠️ **Próximo a Vencer** | 0-15 días | Ámbar |
| ❌ **Vencido** | Menos de 0 días | Rojo |

### Características
- ➕ Agregar nuevos requisitos
- ✏️ Editar requisitos existentes
- 🗑️ Eliminar requisitos
- 📊 Contadores por estado
- 📝 Notas y observaciones
- 🔍 Detalles completos con descripción

### Ubicación
```
Navegación → Documentos (nuevo tab)
    ↓
Selecciona expediente
    ↓
Pestaña "Vigencias"
```

---

## 3. Almacenamiento en localStorage

### ¿Cómo funciona?
Los datos se guardan en el almacenamiento local del navegador, asignados por expediente:

```javascript
// Documentos
localStorage.getItem('docs-{expedienteId}')

// Requisitos y Vigencias
localStorage.getItem('reqs-{expedienteId}')

// Lista de Expedientes
localStorage.getItem('expedientes-list')
```

### Ventajas
✅ Sin dependencia de servidor  
✅ Datos persisten entre sesiones  
✅ Acceso rápido sin latencia  
✅ Privacidad (datos solo en el navegador local)  
✅ Funciona offline  

### Limitaciones
⚠️ Los datos se pierden si se limpia caché del navegador  
⚠️ Capacidad limitada (~5-10MB por dominio)  
⚠️ No se sincroniza entre dispositivos/navegadores  

---

## Flujo de Uso Recomendado

### Paso 1: Navegar a Documentos y Vigencias
```
Sidebar → "Documentos" (nuevo ícono de calendario)
```

### Paso 2: Seleccionar un Expediente
- Busca por número, proveedor u objeto
- Haz clic en la tarjeta del expediente
- O selecciona uno de los expedientes de demostración

### Paso 3: Cargar Documentos
- Haz clic en cada cuadro de documento
- Selecciona archivos PDF, DOC, JPG, XLS, etc.
- Los documentos se cargan instantáneamente
- El progreso se actualiza automáticamente

### Paso 4: Agregar Requisitos y Vigencias
- Haz clic en "Agregar Requisito"
- Completa nombre, fecha y categoría
- Opcionalmente, añade descripción y notas
- El sistema calcula automáticamente el estado

### Paso 5: Monitorear
- Los requisitos próximos a vencer aparecen en ámbar
- Los vencidos en rojo
- Los vigentes en verde

---

## Componentes Creados

### 1. `/hooks/use-local-storage.ts`
Hook personalizado para manejar localStorage de forma segura y reactiva.

```typescript
const [value, setValue, isLoading] = useLocalStorage<T>(key, initialValue)
```

### 2. `/components/expediente-documents.tsx`
Componente de gestión de documentos del expediente.

### 3. `/components/requisitos-vigencias.tsx`
Componente de monitoreo de vigencias.

### 4. `/components/expediente-detalle-view.tsx`
Vista principal que integra ambos módulos.

---

## Ejemplos de Datos de Demostración

El sistema viene precargado con dos expedientes de demostración:

```json
{
  "id": "1",
  "numero": "EXP-2026-0051",
  "unidad": "Despacho del Ministro",
  "objeto": "Suministro de equipos de cómputo",
  "monto": 45000,
  "proveedor": "TechSolutions C.A.",
  "fecha": "2026-05-19"
}
```

Puedes:
- ✅ Agregar documentos a estos expedientes
- ✅ Crear nuevos requisitos y vigencias
- ✅ Editarlos y eliminarlos
- ✅ Los datos se guardarán en localStorage

---

## Próximas Mejoras Posibles

- [ ] Integración con backend para persistencia permanente
- [ ] Exportar expedientes a PDF
- [ ] Notificaciones de vigencias por correo
- [ ] Validación de disponibilidad presupuestaria (SIGECOf)
- [ ] Integración con base de datos de sancionados
- [ ] Soporte para múltiples usuarios
- [ ] Sincronización entre dispositivos
- [ ] Historial de cambios

---

## Notas Técnicas

### Dependencias Requeridas
- `lucide-react` - Iconos
- `@radix-ui/react-tabs` - Componente Tabs (ya instalado)
- React 18+ con hooks

### Compatibilidad
- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ Responsive (móvil, tablet, desktop)
- ✅ Accesibilidad WCAG 2.1 AA

### localStorage y Privacidad
Los datos se guardan **únicamente en el navegador del usuario**:
- No se envía información a servidores
- El usuario tiene control total
- Puede limpiar datos desde DevTools
- No hay tracking de datos

---

## Soporte

Para reportar problemas o sugerencias:
1. Revisa las funciones existentes en los componentes
2. Verifica el navegador y storage disponible
3. Consulta la consola del navegador para errores
4. Intenta limpiar cache y recargar

---

**Versión**: 1.0  
**Fecha**: Mayo 2026  
**Estado**: Funcional
