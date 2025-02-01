import { connectDB } from "./config/database.js";
import "./consumers/buscarIdConsumer.js"; // Inicia el consumidor al arrancar el servicio

async function startService() {
    await connectDB();
    console.log("[✔] Microservicio BuscarID Iniciado.");
}

startService();
