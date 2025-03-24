
export function obtenerConfiguracion() {
    return {
      lambda_code: {
        bucket: process.env.LAMBDA_CODE_BUCKET,
        key: process.env.LAMBDA_CODE_KEY,
      },
      id_security_group: process.env.ID_SECURITY_GROUP,
      id_cuenta_aws: process.env.ID_CUENTA_AWS,
      nombre_lambda: process.env.NOMBRE_LAMBDA,
      runtime: process.env.RUNTIME,
      handler: process.env.HANDLER,
      timeout: parseInt(process.env.TIMEOUT, 10),
      memory_size: parseInt(process.env.MEMORY_SIZE, 10),
      acceso_internet: process.env.ACCESO_INTERNET === 'true',
      desencadenador: {
        api_gateway: {
          id_api_gateway: process.env.API_GATEWAY_ID,
          path: process.env.API_GATEWAY_PATH,
          method: process.env.API_GATEWAY_METHOD,
          proxy: process.env.API_GATEWAY_PROXY === 'true',
        },
      },
      variables_de_entorno: [
        { nombre_variable_entorno: 'VAR_ENTORNO_1', valor: process.env.VAR_ENTORNO_1 },
        { nombre_variable_entorno: 'VAR_ENTORNO_2', valor: process.env.VAR_ENTORNO_2 },
      ],
      permisos_sobre_otros_recursos_aws: [
        {
          nivel_acceso: process.env.PERMISO_1_NIVEL,
          arn_componente_sobre_el_que_se_quiere_permiso: process.env.PERMISO_1_ARN,
        },
      ],
    };
  }