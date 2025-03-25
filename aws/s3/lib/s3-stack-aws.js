const cdk = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const { Construct } = require("constructs");

class S3Stack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    

    // Crear un bucket en S3
    new s3.Bucket(this, "MyS3Bucket", {
      bucketName: props.s3Name,
      versioned: true, 
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: false, 
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, // Bloquear todo el acceso público
    });
  }
}

module.exports = { S3Stack };
