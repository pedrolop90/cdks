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
async function obtenerCredenciales() {
  try {
    const params = {
      FunctionName: process.env.FunctionNameObtenerCredenciales, // Reemplázalo con el nombre de tu Lambda
      InvocationType: "RequestResponse", // Espera respuesta
      Payload: JSON.stringify({ proyecto_id: process.env.PROYECTO_ID }),
    };

    const response = await lambda.invoke(params).promise();

    const data = JSON.parse(response.Payload);

    if (!data.access_key || !data.secret_key) {
      throw new Error("Las credenciales no fueron retornadas correctamente.");
    }

    return { accessKey: data.access_key, secretKey: data.secret_key };

  } catch (error) {
    console.error("Error invocando Lambda:", error.message);
    throw error; 
  }
}


if (require.main === module) {
  obtenerCredenciales()
    .then((credenciales) => {
      const arg = process.argv[2]; // Toma el argumento de la línea de comandos

      if (arg === "accessKey") {
        console.log(credenciales.accessKey);
      } else if (arg === "secretKey") {
        console.log(credenciales.secretKey);
      } else {
        console.log(JSON.stringify(credenciales)); // Si no hay argumento, imprime todo
      }
    })
    .catch((error) => {
      console.error("❌ Error al obtener credenciales:", error);
      process.exit(1);
    });
}
