
# MS-Buscar_IdChat

Este microservicio, **MS-Buscar_IdChat**, se encarga de gestionar la búsqueda de identificadores de chat (ID de chat) en una base de datos MongoDB, integrándose con RabbitMQ para la gestión de colas de mensajes. Está diseñado para funcionar en entornos de microservicios, como Google Cloud Run.

## 🚀 Características Principales

- **Búsqueda de ID de Chat:** Consulta de identificadores de chat en MongoDB.
- **Integración con RabbitMQ:** Escucha eventos de la cola para procesar solicitudes de búsqueda de ID.
- **Despliegue en Cloud Run:** Optimizado para entornos serverless.

## 📊 Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución.
- **Express**: Framework web para el manejo de rutas HTTP.
- **MongoDB**: Base de datos NoSQL para almacenar información de los chats.
- **RabbitMQ (amqplib)**: Mensajería para la gestión de colas.
- **Luxon**: Para la gestión de fechas y horas.
- **dotenv**: Para la configuración de variables de entorno.

## 🛠️ Instalación y Configuración

1. **Clona el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd MS-Buscar_IdChat-dev
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/chatdb
   RABBITMQ_URL=amqp://localhost
   PORT=8080
   ```

4. **Inicia el microservicio:**
   ```bash
   npm run dev
   ```

## 🌐 API Endpoints

- **GET /**
  - Respuesta: `"¡Microservicio en Cloud Run funcionando! 🚀"`

Este endpoint es útil para verificar si el microservicio está funcionando.

## 📢 Consumo de Eventos (RabbitMQ)

El microservicio escucha eventos de la cola configurada en `buscarIdConsumer.js`. Cuando llega un mensaje con un ID de chat, realiza la búsqueda en MongoDB y devuelve la información correspondiente.

## 🚫 Manejo de Errores

El microservicio está preparado para gestionar errores comunes:

- **Errores de conexión a MongoDB**
- **Errores en la conexión con RabbitMQ**
- **Errores en la búsqueda de datos**


## 📂 Estructura del Proyecto

```
MS-Buscar_IdChat-dev/
├── src/
│   ├── config/           # Configuraciones de base de datos y entorno
│   ├── consumers/        # Consumidores de RabbitMQ
│   ├── services/         # Lógica de negocio
│   ├── utils/            # Utilidades y helpers
│   └── index.js          # Punto de entrada principal
├── package.json          # Dependencias y scripts
├── Dockerfile            # Configuración para despliegue en contenedores
└── .env                  # Variables de entorno (no incluido por seguridad)
```


# 📦 Microservicio: Funcionamiento

Este microservicio está diseñado para gestionar la verificación de la existencia de IDs de chat en una base de datos MongoDB. Se integra con RabbitMQ para la gestión de colas de mensajes y utiliza Express para exponer un endpoint HTTP que permite verificar su estado de funcionamiento. 

## 🚀 Descripción General

El microservicio **BuscarID** combina funcionalidades de tres componentes principales:

1. **`verificarIDEnBD`**: Verifica la existencia de un ID de chat en la base de datos MongoDB.

2. **`startConsumer`**: Inicia un consumidor de RabbitMQ para procesar solicitudes de verificación de IDs.

3. **Servidor Express**: Proporciona un endpoint básico para comprobar si el microservicio está en ejecución.

## 📂 Relación con Módulos

### 1️⃣ **Módulo `verificarIDEnBD`**

Este módulo es responsable de consultar MongoDB para verificar si un ID de chat existe. El consumidor de RabbitMQ (`startConsumer`) hace uso directo de esta función para procesar los mensajes recibidos en la cola `BuscarID`.

[Ver Documentacion de `verificarIDEnBD` ](/src/docs/verificarIDEnBD.md)

### 2️⃣ **Módulo `startConsumer`**

Este módulo gestiona la comunicación con RabbitMQ. Se inicia automáticamente cuando el microservicio arranca, ya que está importado en `buscarIdConsumer.js`.

[Ver Documentacion de `verificarIDEnBD` ](/src/docs/startConsumer.md)

## ⚙️ Flujo de Funcionamiento

1. Al iniciar el microservicio:

   - Se establece la conexión con la base de datos MongoDB mediante `connectDB()`.

   - Se inicia el consumidor de RabbitMQ (`startConsumer`), que escucha mensajes en la cola `BuscarID`.

2. Cuando se recibe un mensaje en la cola:

   - Se verifica la existencia del ID de chat con `verificarIDEnBD()`.

   - Según el resultado, el mensaje se redirige a las colas `traer_data`, `ms_gpt`, `Errores_Data` o `Errores_Sistema`.

3. Se expone un endpoint HTTP en `http://localhost:8080/` o el puerto configurado para verificar que el microservicio está activo.


## 📥 Endpoint API

- **GET /**

  Verifica si el microservicio está funcionando:

  ```bash
  curl http://localhost:8080/
  ```
  **Respuesta:**

  ```json
  "¡Microservicio en Cloud Run funcionando! 🚀"
  ```



## 📚 Dependencias

- **MongoDB (Mongoose):** Para la gestión de la base de datos.

- **RabbitMQ (amqplib):** Para la gestión de colas de mensajes.

- **Express:** Para la creación de un servidor HTTP ligero.

- **CustomError:** Para el manejo de errores personalizados.

   [Ver Script de `CustomError` ](/src/utils/error.js)



🚀 **Desarrollado para entornos de microservicios escalables y eficientes.**

