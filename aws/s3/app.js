require('dotenv').config();

const cdk = require("aws-cdk-lib");
const { S3Stack } = require('./s3-stack-aws');

let variables = obtenerConfiguracion();
const app = new cdk.App();
new S3Stack(app, "S3Stack", variables);


function obtenerConfiguracion() {
  return {
    s3Name: process.env.S3_NAME,
    aws_access_key: process.env.AWS_ACCESS_KEY,
    aws_secret_key: process.env.AWS_SECRET_KEY,
  };
}