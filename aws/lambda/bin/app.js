require('dotenv').config();

const cdk = require("aws-cdk-lib");
const { LambdaStack } = require("../lib/lambda-stack-aws");
const { obtenerConfiguracion } = require('./obtener-variables-entorno');
// const { obtenerCredenciales } = require('../../../util/obtener-credenciales');

let variables = obtenerConfiguracion();
// obtenerCredenciales();
const app = new cdk.App();
new LambdaStack(app, "LambdaStack", variables);

