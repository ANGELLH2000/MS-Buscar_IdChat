import { connectRabbitMQ } from "../config/amqp.js";
import { verificarIDEnBD } from "../services/buscarIdService.js";

async function startConsumer() {
    const { channel } = await connectRabbitMQ();

    channel.consume("BuscarID", async (msg) => {
        const { id_chat } = JSON.parse(msg.content.toString());
        console.log(`[📩] Mensaje recibido en BuscarID: ${id_chat}`);

        const existe = await verificarIDEnBD(id_chat);

        if (existe) {
            console.log(`[✔] ID ${id_chat} encontrado. Enviando a traer_data.`);
            channel.sendToQueue("traer_data", Buffer.from(JSON.stringify({ id_chat })));
        } else {
            console.log(`[❌] ID ${id_chat} no encontrado. Enviando a ms_gpt.`);
            channel.sendToQueue("ms_gpt", Buffer.from(JSON.stringify({ id_chat })));
        }

        channel.ack(msg);
    });
}

startConsumer();
