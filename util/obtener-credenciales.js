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
export async function obtenerCredenciales(cliente) {
  try {
    const params = {
      FunctionName: "NombreDeTuLambda", // Reemplázalo con el nombre de tu Lambda
      InvocationType: "RequestResponse", // Espera respuesta
      Payload: JSON.stringify({ cliente }),
    };

    const response = await lambda.invoke(params).promise();

    // Parsear la respuesta de Lambda
    const data = JSON.parse(response.Payload);

    if (!data.accessKey || !data.secretKey) {
      throw new Error("Las credenciales no fueron retornadas correctamente.");
    }

    process.env.AWS_ACCESS_KEY_ID = accessKey;
    process.env.AWS_SECRET_ACCESS_KEY = secretKey;
    
    return { accessKey: data.accessKey, secretKey: data.secretKey };
  } catch (error) {
    console.error("Error invocando Lambda:", error.message);
    throw error; // Relanzar el error para manejarlo externamente
  }
}

// Ejemplo de uso
obtenerCredenciales("cliente123")
  .then((credenciales) => console.log("Credenciales:", credenciales))
  .catch((err) => console.error("Error:", err.message));
