import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const amqpUrl = process.env.AMQP_URL;

/**
 * Conecta a un servidor RabbitMQ y crea las colas necesarias para el procesamiento de mensajes.
 *
 * Esta función establece una conexión con RabbitMQ utilizando la URL definida en las variables de entorno,
 * y asegura la existencia de las siguientes colas:
 * - **BuscarID:** Cola para recibir solicitudes de verificación de ID.
 * - **traer_data:** Cola para procesar solicitudes de datos una vez verificado el ID.
 * - **ms_gpt:** Cola para manejar solicitudes relacionadas con procesamiento de IA (GPT).
 * - **Errores_Sistema:** Cola para registrar errores críticos del sistema después de múltiples intentos fallidos.
 * - **Errores_Data:** Cola para registrar errores relacionados con la validez de los datos.
 *
 * @async
 * @module connectRabbitMQ
 * @throws {Error} Si ocurre un error durante la conexión a RabbitMQ o la creación de las colas.
 * @returns {Promise<{connection: amqp.Connection, channel: amqp.Channel}>} Objeto que contiene la conexión y el canal de RabbitMQ.
 *
 * @example
 * import { connectRabbitMQ } from './config/amqp.js';
 * const { connection, channel } = await connectRabbitMQ();
 * channel.sendToQueue('BuscarID', Buffer.from('Mensaje de prueba'));
 */

export async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(amqpUrl);
        
        const channel = await connection.createChannel();
        
        await channel.assertQueue("BuscarID", { durable: true });// Crea la cola BuscarID
        await channel.assertQueue("traer_data", { durable: true });// Crea la cola traer_data
        await channel.assertQueue("ms_gpt", { durable: true });// Crea la cola ms_gpt
        await channel.assertQueue("Errores_Sistema", { durable: true });// Crea la cola Errores_Sistema
        await channel.assertQueue("Errores_Data", { durable: true });// Crea la cola Errores_Data

        console.log("[✔] Conectado a RabbitMQ");
        return { connection, channel };
    } catch (error) {
        console.error("[❌] Error conectando a RabbitMQ:", error);
        process.exit(1);
    }
}
