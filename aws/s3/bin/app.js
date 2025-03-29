require('dotenv').config();

const cdk = require("aws-cdk-lib");
const { obtenerConfiguracion } = require('./obtener-variables-entorno');
const { S3Stack } = require('../lib/s3-stack-aws');
const { obtenerCredenciales } = require('../obtener-credenciales');

async function main() {
    let variables = obtenerConfiguracion();
    
    console.log("🔄 Obteniendo credenciales...");
    await obtenerCredenciales(variables);

    console.log("✅ Credenciales actualizadas.");
    console.log("🔍 AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID);
    console.log("🔍 AWS_SECRET_ACCESS_KEY:", process.env.AWS_SECRET_ACCESS_KEY);

    // 🔥 Forzar a CDK a recargar credenciales
    process.env.AWS_SDK_LOAD_CONFIG = "1";

    // 🔥 Configurar env después de recibir las credenciales
    variables.env = {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    };

    const app = new cdk.App();
    new S3Stack(app, variables.idStack, variables);
    
    app.synth();
}


main().catch(console.error);
