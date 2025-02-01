import { connectDB } from "./config/database.js";
import "./consumers/buscarIdConsumer.js"; // Inicia el consumidor al arrancar el servicio
import express from  'express'
const app = express();
// Usa el puerto 8080 proporcionado por Cloud Run o un puerto local para pruebas
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('¡Microservicio en Cloud Run funcionando! 🚀');
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});



async function startService() {
    await connectDB();
    console.log("[✔] Microservicio BuscarID Iniciado.");
}

startService();
