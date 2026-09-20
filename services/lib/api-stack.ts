import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { StorageStack } from './storage-stack';
import { OrchestrationStack } from './orchestration-stack';

interface ApiStackProps extends cdk.StackProps {
  storageStack: StorageStack;
  orchestrationStack: OrchestrationStack;
}

export class ApiStack extends cdk.Stack {
  public readonly restApi: apigateway.RestApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    this.restApi = new apigateway.RestApi(this, 'OPED-RestApi', {
      restApiName: 'OPED Backend API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const groqApiKey = process.env.GROQ_API_KEY || '';

    // QueryRouter Lambda (Direct Integration)
    const queryRouter = new nodejs.NodejsFunction(this, 'QueryRouterLambda', {
      entry: 'src/lambdas/queryRouter.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(30),
      environment: {
        GROQ_API_KEY: groqApiKey,
      }
    });

    const searchResource = this.restApi.root.addResource('search');
    searchResource.addMethod('POST', new apigateway.LambdaIntegration(queryRouter));

    // API Gateway -> SQS Integration for CompileRequests
    const credentialsRole = new iam.Role(this, 'ApiGatewaySqsRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    });
    props.orchestrationStack.compileRequestQueue.grantSendMessages(credentialsRole);

    const compileResource = this.restApi.root.addResource('compile');
    compileResource.addMethod('POST', new apigateway.AwsIntegration({
      service: 'sqs',
      path: `${cdk.Aws.ACCOUNT_ID}/${props.orchestrationStack.compileRequestQueue.queueName}`,
      integrationHttpMethod: 'POST',
      options: {
        credentialsRole,
        requestParameters: {
          'integration.request.header.Content-Type': "'application/x-www-form-urlencoded'",
        },
        requestTemplates: {
          'application/json': 'Action=SendMessage&MessageBody=$util.urlEncode("$input.body")&MessageGroupId=$input.path("$.chapterId")'
        },
        integrationResponses: [{ statusCode: '200' }]
      }
    }), {
      methodResponses: [{ statusCode: '200' }]
    });
  }
}
