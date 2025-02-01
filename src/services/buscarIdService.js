import mongoose from "mongoose";
import CustomError from "../utils/error.js";

const chatSchema = new mongoose.Schema();

const Chat = mongoose.model("collecion_bases", chatSchema);

/**
 * * Módulo para verificar la existencia de un ID de chat en la base de datos MongoDB.
 *
 * Utiliza Mongoose para conectarse a la colección `collecion_bases` y verificar si un ID de chat existe.
 *
 * @module verificarIDEnBD
 * Verifica si un ID de chat existe en la base de datos.
 *
 * @async
 * @param {string} id_chat - El ID del chat que se desea verificar.
 * @throws {CustomError} Lanza un error si el ID no es un ObjectId válido o si ocurre un error en la consulta a MongoDB.
 * @returns {Promise<boolean>} Devuelve `true` si el ID existe en la base de datos, de lo contrario `false`.
 *
 * @example
 * const existe = await verificarIDEnBD("60d5f99f9e1c8c3f0c8d4b5a");
 * console.log(existe); // true o false
 */
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
