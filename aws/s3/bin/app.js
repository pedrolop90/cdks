require('dotenv').config();

const cdk = require("aws-cdk-lib");
const { obtenerConfiguracion } = require('./obtener-variables-entorno');
const { S3Stack } = require('../lib/s3-stack-aws');
// const { obtenerCredenciales } = require('../../../util/obtener-credenciales');

let variables = obtenerConfiguracion();
//obtenerCredenciales();
const app = new cdk.App();
new S3Stack(app, "S3Stack", variables);

