
# 📦 Módulo: startConsumer

Este módulo define e inicia un consumidor de mensajes para RabbitMQ que verifica la existencia de un ID de chat en una base de datos MongoDB. El consumidor escucha en la cola `BuscarID`, procesa el mensaje, verifica si el ID de chat existe y redirige el mensaje según el resultado de la verificación o los errores encontrados.

## 🚀 Descripción General

El consumidor procesa mensajes que contienen IDs de chat, verifica su existencia en la base de datos y los redirige a diferentes colas de RabbitMQ según el resultado:

- **Si el ID existe:** Se envía el mensaje a la cola `traer_data`.

- **Si el ID no existe:** Se envía a la cola `ms_gpt`.

- **Errores en los datos:** Se envía a la cola `Errores_Data`.

- **Errores del sistema (tras 2 reintentos):** Se envía a la cola `Errores_Sistema`.

## 📥 Parámetros de Entrada

El consumidor recibe mensajes con la siguiente estructura:

```json
{
  "id_chat": "string",
  "attempts": 0
}
```

- **id_chat** (`string`): ID del chat a verificar.

- **attempts** (`number`, opcional): Número de intentos realizados para procesar el mensaje (por defecto es `0`).

## 📤 Salida del Consumidor

El consumidor envía mensajes a diferentes colas dependiendo del resultado del procesamiento:

- **Cola `traer_data`:** Si el ID de chat existe en la base de datos.

- **Cola `ms_gpt`:** Si el ID de chat no existe en la base de datos.

- **Cola `Errores_Data`:** Para errores relacionados con la validez de los datos.

- **Cola `Errores_Sistema`:** Para errores del sistema después de 2 reintentos fallidos.

## ❗ Manejo de Errores

### Errores de Datos

Si ocurre un error relacionado con los datos (como un ID inválido), se envía un mensaje a la cola `Errores_Data`:

```json
{
  "id_chat": "string",
  "error": "Mensaje de error",
  "ms": "Nombre del servicio",
  "date": "Fecha y hora del error"
}
```

### Errores del Sistema

Si ocurre un error del sistema y falla tras 2 reintentos, el mensaje se envía a la cola `Errores_Sistema`:

```json
{
  "id_chat": "string",
  "error": "Mensaje de error",
  "ms": "Nombre del servicio",
  "errordetails": "Detalles del error",
  "date": "Fecha y hora del error"
}
```

## 🔄 Reintentos

- En caso de error del sistema, el mensaje se reintenta hasta 2 veces.

- Después de 2 intentos fallidos, se considera un error crítico y el mensaje se mueve a `Errores_Sistema`.


## 📝 Ejemplo de Uso

```bash
# Para iniciar el consumidor simplemente ejecuta el archivo:
node startConsumer.js
```

## 📚 Dependencias

- **RabbitMQ:** Para la gestión de colas de mensajes.

- **MongoDB (Mongoose):** Para la verificación de la existencia del ID de chat.

- **Luxon:** Para la gestión de fechas y horas.

- **CustomError:** Para la gestión personalizada de errores.




---

🚀 **Desarrollado para entornos de microservicios escalables y eficientes.**
