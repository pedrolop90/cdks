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
    const awsCredentialsPath = path.join(os.homedir(), ".aws", "credentials");
    const profileName = "dynamic-profile";

    const credentialsFileContent = `
[${profileName}]
aws_access_key_id=${credenciales.accessKey}
aws_secret_access_key=${credenciales.secretKey}
    `.trim();

    fs.writeFileSync(awsCredentialsPath, credentialsFileContent, { flag: "w" });

    // 🔥 Usar el nuevo perfil en CDK
    process.env.AWS_PROFILE = profileName;

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
