import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const amqpUrl = process.env.AMQP_URL;

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
