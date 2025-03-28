
export function obtenerConfiguracion() {
  return {
    s3Name: process.env.S3_NAME,
    functionNameObtenerCredenciales: process.env.FunctionNameObtenerCredenciales,
  };
}