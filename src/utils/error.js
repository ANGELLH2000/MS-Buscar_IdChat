/**
 * Clase personalizada para manejar errores con códigos de estado específicos.
 *
 * Extiende la clase `Error` de JavaScript y agrega un código de estado (`statusCode`),
 * lo que permite un manejo más preciso de errores en aplicaciones que utilizan respuestas HTTP.
 *
 * @class CustomError
 * @extends Error
 * @param {string} message - Mensaje descriptivo del error.
 * @param {number} statusCode - Código de estado HTTP asociado al error.
 *
 * @example
 * throw new CustomError("No autorizado", 401);
 */
export default class CustomError extends Error {
    constructor(message, Queue_destino,errordetails="") {
        super(message);
        this.Queue_destino= Queue_destino;
        this.name_service = "MS-Buscar_IDChat";
        this.errordetails=errordetails;
    }
}
