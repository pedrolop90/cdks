
require('dotenv').config();

function obtenerConfiguracion() {
  return {
    s3Name: process.env.S3_NAME,
    proyecto_id: process.env.PROYECTO_ID,
    functionNameObtenerCredenciales: process.env.FunctionNameObtenerCredenciales,
  };
}

module.exports = { obtenerConfiguracion };