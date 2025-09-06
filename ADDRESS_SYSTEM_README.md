# 🏠 Sistema de Direcciones para México

## 📋 Descripción
Sistema completo de gestión de direcciones con búsqueda automática de códigos postales mexicanos, colonias, ciudades y estados.

## 🚀 Características

### ✅ Funcionalidades Implementadas
- **Búsqueda por código postal**: API integrada con Sepomex
- **Selección de colonias**: Dropdown con opciones automáticas
- **Validación mexicana**: Solo direcciones en México
- **Gestión completa**: CRUD de direcciones
- **Dirección principal**: Sistema de dirección por defecto
- **UI responsiva**: Componentes modernos y accesibles

### 🛠️ Componentes Creados
1. **`/api/zipcode/[cp].ts`** - API para búsqueda de códigos postales
2. **`hooks/useZipCode.ts`** - Hook personalizado para búsqueda
3. **`components/forms/AddressForm.tsx`** - Formulario completo de direcciones
4. **`pages/addresses/index.tsx`** - Página de gestión de direcciones
5. **`components/checkout/AddressSelector.tsx`** - Selector para checkout
6. **`contexts/AuthContext.tsx`** - Contexto de autenticación

## 📦 Instalación

### 1. Ejecutar Script de Base de Datos
```sql
-- Ejecutar en Supabase SQL Editor
\i update_address_schema.sql
```

### 2. Verificar Estructura
La tabla `user_addresses` ahora incluye:
- `codigo_postal` (VARCHAR(5), NOT NULL)
- `numero_exterior` (VARCHAR(20), NOT NULL) 
- `numero_interior` (VARCHAR(20), NULL)
- `referencias` (TEXT, NULL)
- Campo `country` eliminado
- Validación de código postal mexicano

### 3. Configurar Variables de Entorno
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_supabase
```

## 🎯 Uso

### Formulario de Direcciones
```tsx
import { AddressForm } from '../components/forms/AddressForm';

<AddressForm
  onSubmit={(data) => console.log(data)}
  initialData={existingAddress}
  loading={false}
/>
```

### Selector de Direcciones
```tsx
import { AddressSelector } from '../components/checkout/AddressSelector';

<AddressSelector
  onAddressSelect={(address) => setSelectedAddress(address)}
  selectedAddressId={selectedId}
/>
```

### Hook de Búsqueda
```tsx
import { useZipCode } from '../hooks/useZipCode';

const { loading, error, results, searchZipCode } = useZipCode();
```

## 🔧 API Endpoints

### GET `/api/zipcode/[cp]`
Busca información de código postal mexicano.

**Parámetros:**
- `cp`: Código postal de 5 dígitos

**Respuesta:**
```json
{
  "codigo_postal": "12345",
  "resultados": [
    {
      "codigo_postal": "12345",
      "asentamiento": "Centro",
      "tipo_asentamiento": "Colonia",
      "municipio": "Ciudad de México",
      "estado": "CDMX",
      "ciudad": "Ciudad de México"
    }
  ],
  "total": 1
}
```

## 🎨 Flujo de Usuario

1. **Usuario ingresa código postal** (5 dígitos)
2. **Sistema busca automáticamente** colonias disponibles
3. **Usuario selecciona colonia** del dropdown
4. **Sistema completa automáticamente** ciudad y estado
5. **Usuario completa** calle, número exterior, etc.
6. **Sistema valida** y guarda la dirección

## 🛡️ Validaciones

### Código Postal
- ✅ Exactamente 5 dígitos
- ✅ Solo números
- ✅ Debe existir en México

### Campos Obligatorios
- ✅ Código postal
- ✅ Colonia (seleccionada de la lista)
- ✅ Calle
- ✅ Número exterior

### Campos Opcionales
- ⚪ Número interior
- ⚪ Referencias

## 🚨 Manejo de Errores

### API de Códigos Postales
- **404**: Código postal no encontrado
- **400**: Formato inválido
- **500**: Error del servidor

### Base de Datos
- **Constraint violation**: Código postal inválido
- **RLS**: Usuario no autorizado
- **Unique constraint**: Dirección duplicada

## 📱 Responsive Design

- **Mobile**: Formulario de una columna
- **Tablet**: Formulario de dos columnas
- **Desktop**: Formulario optimizado con grid

## 🔄 Próximos Pasos

1. **Integrar con checkout** existente
2. **Agregar validación de entrega** por código postal
3. **Implementar geocodificación** para mapas
4. **Agregar historial** de direcciones
5. **Optimizar API** con caché

## 🐛 Solución de Problemas

### Error: "Código postal no encontrado"
- Verificar que el CP tenga 5 dígitos
- Comprobar conexión a internet
- Revisar logs de la API

### Error: "Función no encontrada"
- Ejecutar `update_address_schema.sql`
- Verificar permisos de base de datos
- Revisar logs de Supabase

### Error: "Usuario no autorizado"
- Verificar autenticación
- Comprobar políticas RLS
- Revisar contexto de usuario

## 📞 Soporte

Para problemas técnicos:
1. Revisar logs de consola
2. Verificar estructura de base de datos
3. Comprobar variables de entorno
4. Revisar políticas RLS

---

**¡Sistema de direcciones mexicano implementado exitosamente! 🇲🇽**
