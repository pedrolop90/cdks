require('dotenv').config();

const { obtenerConfiguracion } = require('./obtener-variables-entorno');
const { obtenerCredenciales } = require('../obtener-credenciales');

async function main() {
    let variables = obtenerConfiguracion();

    console.log("🔄 Obteniendo credenciales...");
    const credenciales = await obtenerCredenciales(variables);

    // 🔥 Establecer credenciales en el proceso antes de ejecutar CDK
    process.env.AWS_ACCESS_KEY_ID = credenciales.accessKey;
    process.env.AWS_SECRET_ACCESS_KEY = credenciales.secretKey;

    console.log("🚀 Credenciales actualizadas para CDK");

    // 🔥 Crear una nueva instancia de credenciales y forzar a CDK a usarlas
    const aws = require("aws-sdk");
    aws.config.credentials = new aws.Credentials(credenciales.accessKey, credenciales.secretKey);


    process.env.AWS_SDK_LOAD_CONFIG = "1";

    const cdk = require("aws-cdk-lib");
    const { S3Stack } = require('../lib/s3-stack-aws');
    const app = new cdk.App();

    variables.env = {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    };


    new S3Stack(app, variables.idStack, variables);

    app.synth();
}


main().catch(console.error);
