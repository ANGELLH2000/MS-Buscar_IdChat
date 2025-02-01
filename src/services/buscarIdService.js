import mongoose from "mongoose";

const chatSchema = new mongoose.Schema();

const Chat = mongoose.model("collecion_bases", chatSchema);

export async function verificarIDEnBD(id_chat) {
    try {
        const existe = await Chat.findById(id_chat);
        return !!existe; // Devuelve true si existe, false si no.
    } catch (error) {
        console.error("[❌] Error consultando MongoDB:", error);
        return false;
    }
}
