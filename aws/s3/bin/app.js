require('dotenv').config();

const cdk = require("aws-cdk-lib");
const { obtenerConfiguracion } = require('./obtener-variables-entorno');
const { S3Stack } = require('../lib/s3-stack-aws');
const { obtenerCredenciales } = require('../obtener-credenciales');

let variables = obtenerConfiguracion();
obtenerCredenciales(variables);
const app = new cdk.App();

variables.env = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,  
};
new S3Stack(app, variables.idStack, variables);

