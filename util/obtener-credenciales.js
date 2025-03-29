require('dotenv').config();
const AWS = require("aws-sdk");

// Configurar AWS Lambda
const lambda = new AWS.Lambda({
  region: "us-east-1", // Cambia esto a tu región AWS
});

/**
 * Invoca una función Lambda para obtener credenciales de un cliente.
 * @param {string} cliente - Nombre o ID del cliente.
 * @returns {Promise<{ accessKey: string, secretKey: string }>} - Credenciales obtenidas.
 */
async function obtenerCredenciales(request) {
  try {
    const params = {
      FunctionName: request.functionNameObtenerCredenciales, // Reemplázalo con el nombre de tu Lambda
      InvocationType: "RequestResponse", // Espera respuesta
      Payload: JSON.stringify({ proyecto_id: request.proyecto_id }),
    };

    const response = await lambda.invoke(params).promise();

    // Parsear la respuesta de Lambda
    console.log(response);
    const data = JSON.parse(response.Payload);

    if (!data.access_key || !data.secret_key) {
      throw new Error("Las credenciales no fueron retornadas correctamente.");
    }

    process.env.AWS_ACCESS_KEY_ID = data.access_key;
    process.env.AWS_SECRET_ACCESS_KEY = data.secret_key;
    
    AWS.config.update({
      accessKeyId: data.access_key,
      secretAccessKey: data.secret_key,
    });

  } catch (error) {
    console.error("Error invocando Lambda:", error.message);
    throw error; // Relanzar el error para manejarlo externamente
  }
}


module.exports = { obtenerCredenciales };
