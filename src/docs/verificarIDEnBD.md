
# 📦 Módulo: verificarIDEnBD

Este módulo proporciona una función para verificar la existencia de un ID de chat en una base de datos MongoDB utilizando Mongoose.

## 🚀 Descripción General

La función `verificarIDEnBD` permite comprobar si un ID de chat específico existe en la colección `collecion_bases` de MongoDB. Está diseñada para integrarse en sistemas de microservicios que requieren validación de datos en tiempo real.

## ⚙️ Parámetros

- **`id_chat`** (`string`): El ID del chat que se desea verificar en la base de datos.

## 📥 Retorno

- **`Promise<boolean>`**: 
  - Retorna `true` si el ID de chat existe en la base de datos.
  - Retorna `false` si el ID no existe.

## ❗ Manejo de Errores

- Lanza un `CustomError` si:
  - El `id_chat` no es un `ObjectId` válido.
  - Ocurre un error durante la consulta a la base de datos MongoDB.

## 📝 Ejemplo de Uso

```javascript
import { verificarIDEnBD } from './path/to/module';

(async () => {
    const existe = await verificarIDEnBD("60d5f99f9e1c8c3f0c8d4b5a");
    console.log(existe); // true o false
})();
```

## 🔍 Detalles Técnicos

- **Conexión a MongoDB:** Utiliza Mongoose para la interacción con la base de datos.
- **Modelo de Datos:** Se conecta a la colección `collecion_bases`.
- **Validación:** Se valida que el `id_chat` sea un `ObjectId` válido antes de realizar la consulta.

## 📚 Dependencias

- **Mongoose:** Para la gestión de la base de datos MongoDB.
- **CustomError:** Manejador personalizado de errores.



---

🚀 **Desarrollado para entornos de microservicios escalables y eficientes.**
