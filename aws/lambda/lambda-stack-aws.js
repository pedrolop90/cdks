const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const iam = require("aws-cdk-lib/aws-iam");
const s3 = require("aws-cdk-lib/aws-s3");
const { Construct } = require("constructs");

class LambdaStack extends Construct {
  constructor(scope, props) {
    super(scope, props.nombre_lambda);

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
      vpcSubnets: props.acceso_internet ? undefined : { subnetType: cdk.aws_ec2.SubnetType.PRIVATE },
    });

    if (props.desencadenador.api_gateway) {
      const apiGw = cdk.aws_apigateway.RestApi.fromRestApiId(this, "API", props.desencadenador.api_gateway.id_api_gateway);
      const resource = apiGw.root.addResource(props.desencadenador.api_gateway.path);
      resource.addMethod(props.desencadenador.api_gateway.method, new cdk.aws_apigateway.LambdaIntegration(this, {
        proxy: props.desencadenador.api_gateway.proxy,
      }));
    }
  }
}

module.exports = { LambdaStack };
