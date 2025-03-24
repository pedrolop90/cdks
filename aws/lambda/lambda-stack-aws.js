const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const iam = require("aws-cdk-lib/aws-iam");
const s3 = require("aws-cdk-lib/aws-s3");
const apigateway = require("aws-cdk-lib/aws-apigateway");

class LambdaStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log(props);
      
    const lambdaRole = new iam.Role(this, `${props.nombre_lambda}-role`, {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
      ],
    });

    // Si hay permisos específicos sobre otros recursos
    if (props.permisos_sobre_otros_recursos_aws) {
      props.permisos_sobre_otros_recursos_aws.forEach((permiso) => {
        lambdaRole.addToPolicy(
          new iam.PolicyStatement({
            actions: [permiso.nivel_acceso],
            resources: [permiso.arn_componente_sobre_el_que_se_quiere_permiso],
          })
        );
      });
    }
    console.log("_______"+ props.nombre_lambda);
    new lambda.Function(this, props.nombre_lambda, {
      functionName: props.nombre_lambda,
      runtime: lambda.Runtime[props.runtime.toUpperCase()],
      handler: props.handler,
      code: lambda.Code.fromBucket(
        s3.Bucket.fromBucketName(this, "LambdaBucket", props.lambda_code.bucket),
        props.lambda_code.key
      ),
      timeout: cdk.Duration.seconds(props.timeout),
      memorySize: props.memory_size,
      role: lambdaRole,
      environment: Object.fromEntries(
        props.variables_de_entorno.map((env) => [env.nombre_variable_entorno, env.valor])
      ),
    });

    if (props.desencadenador.api_gateway) {
      const apiGw = apigateway.RestApi.fromRestApiId(
        this, 
        "API", 
        props.desencadenador.api_gateway.id_api_gateway
      );
      const resource = apiGw.root.addResource(props.desencadenador.api_gateway.path);
      resource.addMethod(
        props.desencadenador.api_gateway.method,
        new apigateway.LambdaIntegration(this, {
          proxy: props.desencadenador.api_gateway.proxy,
        })
      );
    }
  }
}

module.exports = { LambdaStack };
