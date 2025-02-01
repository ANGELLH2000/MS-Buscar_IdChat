import { connectRabbitMQ } from "../config/amqp.js";
import { verificarIDEnBD } from "../services/buscarIdService.js";
import CustomError from "../utils/error.js";
import { DateTime } from 'luxon';

/**
 * Inicia un consumidor de mensajes en RabbitMQ para verificar la existencia de un ID de chat.
 *
 * Este consumidor escucha en la cola `BuscarID`, verifica si el ID de chat existe en la base de datos,
 * y envía el resultado a diferentes colas según el estado de la verificación.
 *
 * **Manejo de Errores:**
 * - **Errores de Datos:** Si ocurre un error relacionado con los datos del mensaje (por ejemplo, un ID inválido),
 *   el mensaje se envía a la cola `Errores_Data` con la siguiente estructura:
 *   ```json
 *   {
 *     "id_chat": "<ID del chat>",
 *     "error": "<Mensaje de error>",
 *     "ms": "<Nombre del servicio que generó el error>",
 *     "date": "<Fecha y hora del error>"
 *   }
 *   ```
 * - **Errores del Sistema:** Si ocurre un error del sistema y después de 2 intentos fallidos de reintento,
 *   el mensaje se envía a la cola `Errores_Sistema` con la siguiente estructura:
 *   ```json
 *   {
 *     "id_chat": "<ID del chat>",
 *     "error": "<Mensaje de error>",
 *     "ms": "<Nombre del servicio que generó el error>",
 *     "errordetails": "<Detalles adicionales del error>",
 *     "date": "<Fecha y hora del error>"
 *   }
 *   ```
 * - **Reintentos:** Si ocurre un error del sistema, el mensaje se reintenta hasta 2 veces antes de enviarlo
 *   a la cola `Errores_Sistema`.
 *
 * **Flujo de Procesamiento:**
 * 1. Si el ID de chat existe, el mensaje se envía a la cola `traer_data`.
 * 2. Si el ID de chat no existe, el mensaje se envía a la cola `ms_gpt`.
 * 3. En caso de errores, el mensaje se dirige a `Errores_Data` o `Errores_Sistema` según corresponda.
 *
 * @async
 * @module startConsumer
 * @throws {CustomError} Si ocurre un error durante la validación del mensaje o la consulta a la base de datos.
 * @returns {Promise<void>} No devuelve un valor, pero mantiene el consumidor en funcionamiento para procesar mensajes entrantes.
 *
 * @example
 * // Para iniciar el consumidor simplemente ejecuta el archivo:
 * node startConsumer.js
 */
async function startConsumer() {

    const { channel } = await connectRabbitMQ();
    channel.prefetch(1);

    channel.consume("BuscarID", async (msg) => {
        
        const { id_chat, attempts = 0 } = JSON.parse(msg.content.toString());// Parsea el mensaje
        try {
            if (msg === null) throw new CustomError("Mensaje recibido nulo", "Errores_Data");

            if (id_chat === null || id_chat === undefined || id_chat.length === 0) throw new CustomError(`ID_CHAT nulo`, "Errores_Data");
            if (id_chat.length < 24) throw new CustomError(`ID_CHAT inválido: '${id_chat}', tiene menos de 24 carácteres `, "Errores_Data");

            console.log(`[📩] Mensaje recibido en BuscarID: ${id_chat}`);//
            const existe = await verificarIDEnBD(id_chat);// Verifica si el ID existe en la BD

            if (existe) {
                console.log(`✅ ID ${id_chat} encontrado. Enviando msg a 'traer_data'.`);
                channel.sendToQueue("traer_data", Buffer.from(JSON.stringify({ id_chat })));
            } else {
                console.log(`❌ ID ${id_chat} no encontrado. Enviando a ms_gpt.`);
                channel.sendToQueue("ms_gpt", Buffer.from(JSON.stringify({ id_chat })));
            }
            channel.ack(msg); // Confirmar procesamiento exitoso

        } catch (error) {
            const now = DateTime.now();
            console.error("⚠️ Error procesando el mensaje:");
            if (error.Queue_destino === "Errores_Data") {
                console.log(`💀💀 Enviando mensaje a Errores_Data`);
                channel.sendToQueue("Errores_Data", Buffer.from(JSON.stringify({ id_chat:`${id_chat}`, error: error.message, ms: error.name_service, date:now.toString()})));
                channel.ack(msg);
            } else {
                if (attempts < 2) {
                    // Reintento máximo de 2 veces
                    console.log(`🔄 Reintentando mensaje (${attempts + 1}/2)...`);
                    channel.sendToQueue("BuscarID", Buffer.from(JSON.stringify({ id_chat, attempts: attempts + 1 })));
                } else {
                    // Después de 2 intentos fallidos, enviar a la Dead Letter Queue
                    console.log(`💀 Enviando mensaje a Errores_Sistema`);
                    channel.sendToQueue("Errores_Sistema", Buffer.from(JSON.stringify({ id_chat, error: error.message, ms: error.name_service ,errordetails:error.errordetails,date:now.toString()})));
                }
                channel.ack(msg); // Confirmar incluso si falló para evitar bloqueos
            }
        }
    });
}

startConsumer();
