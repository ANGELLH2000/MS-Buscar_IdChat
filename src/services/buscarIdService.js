import mongoose from "mongoose";
import CustomError from "../utils/error.js";

const chatSchema = new mongoose.Schema();

const Chat = mongoose.model("collecion_bases", chatSchema);

export async function verificarIDEnBD(id_chat) {
    try {
        if (!mongoose.Types.ObjectId.isValid(id_chat)) throw new CustomError(`ID_CHAT inválido: '${id_chat}', no es un ObjectId válido`, "Errores_Data");
        const existe = await Chat.findById(id_chat);
        return !!existe; // Devuelve true si existe, false si no.
    } catch (error) {
        console.error("[❌] Error consultando MongoDB")
        if (error.Queue_destino !== "Errores_Data") throw new CustomError("Error consultando MongoDB", "Errores_Sistema", error);
        throw new CustomError(error.message, "Errores_Data");

    }
}
