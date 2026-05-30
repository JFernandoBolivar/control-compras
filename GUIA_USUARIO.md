# Guía de Usuario - Sistema MPPRIJP v2.0

## Inicio Rápido

### Acceso al Sistema
```bash
# Instalar dependencias
pnpm install

# Iniciar servidor
pnpm dev

# Abrir en navegador
http://localhost:3000
```

---

## Navegación Principal

El sistema cuenta con **4 secciones principales** accesibles desde el **sidebar izquierdo**:

### 1. 📊 Dashboard Gerencial
**Ubicación**: Primer item del sidebar (activo por defecto)

**Contenido**:
- **4 KPI Cards** en la parte superior:
  - Trazabilidad: 100%
  - Expedientes Activos: 550
  - Alertas Críticas: 12
  - Usuarios Activos: 24

- **Gráfico de Barras**: Evolución de expedientes por mes
- **Gráfico de Pastel**: Estado de expedientes (Completados, En Proceso, Pendientes)
- **Gráfico de Línea**: Tendencia de velocidad de procesamiento

**Interacciones**:
- Hover sobre cards para ver efecto visual
- Click sobre items para más detalles (próximas versiones)

---

### 2. ⏱️ Timeline de Trazabilidad
**Ubicación**: Segundo item del sidebar

**Contenido**:
- Historial cronológico de 6 expedientes
- Estado visual de cada expediente
- Información del usuario responsable

**Estados Mostrados**:
- ✅ Completado (verde)
- 🔄 En Progreso (azul)
- ⏳ Pendiente (ámbar)
- ❌ Rechazado (rojo)

**Buscador Integrado**:
```
Buscar por:
- Número de expediente (ej: EXP-2026-0039)
- Nombre del usuario (ej: Rosa García)
- Título del evento
- Descripción
```

**Ejemplo de Uso**:
1. Click en Timeline en el sidebar
2. Verás el campo de búsqueda en la parte superior
3. Escribe "Rosa García" para filtrar eventos
4. Resultado: 1 evento de auditoría

---

### 3. 🔔 Centro de Alertas
**Ubicación**: Tercer item del sidebar

**Contenido**:
- Estadísticas en cards:
  - Alertas Críticas
  - Advertencias
  - Total de Alertas
- Lista de 6 alertas diferentes
- Filtros por tipo

**Tipos de Alertas**:
- 🚨 **Críticas** (Rojo) - Acción inmediata
- ⚠️ **Advertencias** (Ámbar) - Monitoreo
- ℹ️ **Información** (Azul) - Informativas
- ✅ **Exitosas** (Verde) - Confirmaciones

**Buscador Integrado**:
```
Buscar por:
- Título de la alerta
- Descripción
- Número de expediente
```

**Filtros Disponibles**:
- Todas (por defecto)
- Críticas (2)
- Advertencias (2)
- Información (1)
- Exitosas (1)

**Interacciones**:
1. Usa el buscador para filtrar alertas rápidamente
2. Usa los botones de filtro para ver por categoría
3. Click en el ícono papelera para eliminar una alerta

**Ejemplo de Uso**:
1. Click en Alertas en el sidebar
2. Escribe "Validación" en el buscador
3. Resultado: Se muestran 2 alertas relacionadas con validación
4. Click en "Críticas" para ver solo alertas críticas

---

### 4. 📝 Gestión de Expedientes
**Ubicación**: Cuarto item del sidebar

**Estructura**: Formulario con 3 secciones

#### Sección 1: Datos Identificativos del Trámite
- **Tipo de Trámite**: OC (Orden de Compra) u OS (Orden de Servicio)
- **Número de Orden**: Autocompletable (ej: 2026-0001)
- **Fecha de Ingreso**: Selector de fecha
- **Unidad Usuaria**: Selector de dependencia
- **Punto de Cuenta**: Código presupuestario
- **Objeto de Contratación**: Descripción del servicio/bien

#### Sección 2: Datos del Contratista
- **RIF**: Tipo (J/V/E/G) + Número
- **Razón Social**: Nombre de la empresa
- *Nota: Se carga automáticamente si existe en BD*

#### Sección 3: Datos Financieros y Presupuestarios
- **Partida Presupuestaria**: Código (ej: 4.02.00.00.00)
- **Monto Base**: Cantidad en Bs
- **Modalidad**: Contratación Abierta, Restringida, etc.

**Botones de Acción**:
- **Limpiar**: Borra todos los campos
- **Registrar Expediente**: Envía el formulario

**Mensaje de Éxito**:
Tras registrar exitosamente:
```
Expediente Registrado Correctamente
Número de Expediente: EXP-2026-0052
Hash de Trazabilidad: a7f3c9e2
Fecha de Ingreso: 19/05/2026 14:32:45
```

**Validaciones**:
- ✅ Todos los campos marcados con * son obligatorios
- ✅ Formato de RIF debe ser válido
- ✅ Monto debe ser un número positivo
- ✅ Fecha no puede ser futura

---

## Características Principales

### Buscador Global
**Ubicación**: Centro de Alertas y Timeline

**Cómo usar**:
1. Haz click en el campo de búsqueda
2. Escribe tu consulta
3. Los resultados se filtran en tiempo real
4. Borra el texto para restaurar la vista completa

**Tips**:
- La búsqueda NO es sensible a mayúsculas/minúsculas
- Funciona parcialmente (no necesita texto exacto)
- Busca en múltiples campos simultáneamente

---

### Navegación entre Secciones
**Método**: Click en los items del sidebar

**Visual**:
- Item activo: Fondo azul brillante
- Otros items: Gris oscuro con hover effect
- Cada item tiene icono y descripción

---

## Atajos y Tips

### Navegación Rápida
| Atajo | Acción |
|-------|--------|
| Click en Dashboard | Ver KPIs y gráficos |
| Click en Timeline | Buscar histórico |
| Click en Alertas | Ver notificaciones |
| Click en Expedientes | Registrar nuevo |

### Búsqueda Eficiente
- **En Alertas**: Busca por "Críticas" para emergencias
- **En Timeline**: Busca por usuario para ver su actividad
- **Especificidad**: Cuanto más específico, mejores resultados

### Filtrado Avanzado
1. En Alertas: Usa filtros por tipo PRIMERO
2. Luego: Usa búsqueda para refinar
3. Resultado: Búsqueda rápida y precisa

---

## Resolución de Problemas

### El buscador no encuentra resultados
**Solución**:
1. Verifica la ortografía
2. Intenta con términos parciales
3. Revisa si el filtro está limitando resultados

### La página se carga lentamente
**Solución**:
1. Recarga la página (F5)
2. Limpia el caché del navegador
3. Cierra otras pestañas

### Un expediente no aparece en el timeline
**Solución**:
1. Verifica el número exacto del expediente
2. Asegúrate que existe (fue registrado)
3. Usa la búsqueda en lugar de scroll manual

---

## Accesibilidad

### Navegación por Teclado
- `Tab`: Navega entre elementos
- `Enter`: Activa botones
- `Esc`: Cierra diálogos (próximas versiones)

### Contraste Visual
- Texto claro en fondos oscuros
- Colores diferenciados para estados
- Iconos para rápida identificación

### Pantallas Móviles
- Interfaz adaptada para 375px
- Sidebar colapsable (próximas versiones)
- Touch-friendly buttons

---

## Privacidad y Seguridad

### Datos Mostrados
- Todos los datos son de ejemplo
- No contienen información personal real
- Hash de trazabilidad es simulado

### Funcionalidades Seguras
- Validación en cliente
- Encriptación en servidor (próximamente)
- Logs de auditoría automáticos

---

## FAQ

**P: ¿Cómo elimino una alerta?**
R: Click en el icono papelera en la esquina derecha de la alerta.

**P: ¿Puedo editar un expediente ya registrado?**
R: En esta versión no, pero está programado para v2.1.

**P: ¿Dónde veo mi historial de búsquedas?**
R: Se guardará automáticamente en v2.1.

**P: ¿Qué significa el punto verde en el sidebar?**
R: Indica que el sistema está "Operativo" y listo para usar.

**P: ¿Puedo exportar reportes?**
R: Está disponible en Dashboard (próximas versiones).

---

## Contacto y Soporte

Para consultas o reportar problemas:
- 📧 Email: soporte@mpprijp.gob.ve
- 📞 Teléfono: (+58) 2123-CONTROL
- 🌐 Portal: www.mpprijp.gob.ve

---

**Última actualización**: Mayo 19, 2026
**Versión**: 2.0
**Estado**: Completamente funcional
