import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const amqpUrl = process.env.AMQP_URL;

export async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();
        await channel.assertQueue("BuscarID", { durable: true });
        await channel.assertQueue("traer_data", { durable: true });
        await channel.assertQueue("ms_gpt", { durable: true });

        console.log("[✔] Conectado a RabbitMQ");
        return { connection, channel };
    } catch (error) {
        console.error("[❌] Error conectando a RabbitMQ:", error);
        process.exit(1);
    }
}
