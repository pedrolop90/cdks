const cdk = require("aws-cdk-lib");
const { LambdaStack } = require("./lambda-stack-aws");

const app = new cdk.App();
new LambdaStack(app, "LambdaStack", {});
