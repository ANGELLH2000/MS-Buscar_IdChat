import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const amqpUrl = process.env.AMQP_URL;

async function sendTestMessage(id_chat) {
    try {
        const connection = await amqp.connect(amqpUrl);
        const channel = await connection.createChannel();
        await channel.assertQueue("BuscarID", { durable: true });

        const mensaje = JSON.stringify({ id_chat: id_chat });

        const sent= channel.sendToQueue("BuscarID", Buffer.from(mensaje), { persistent: true });
        if (sent) {
            console.log(`[✔] Mensaje enviado a BuscarID: ${mensaje}`);
        } else {
            console.error("[❌] Error: el mensaje no se pudo enviar.");
        }

        //console.log(`[📤] Mensaje enviado a BuscarID: ${mensaje}`);

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error("[❌] Error enviando mensaje a RabbitMQ:", error);
    }
}

// 📌 Modifica este ID para hacer pruebas con diferentes valores
const id_chat_prueba = "678bee93eee8cf5eefd4d37c";
sendTestMessage(id_chat_prueba);