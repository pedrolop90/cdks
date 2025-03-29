require('dotenv').config();

const cdk = require("aws-cdk-lib");
const { S3Stack } = require('../lib/s3-stack-aws');
const { obtenerConfiguracion } = require('./obtener-variables-entorno');


async function main() {
    let variables = obtenerConfiguracion();

    const app = new cdk.App();

    variables.env = {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    };


    new S3Stack(app, variables.idStack, variables);
}


main().catch(console.error);
