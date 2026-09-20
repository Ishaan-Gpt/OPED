import * as cdk from 'aws-cdk-lib';
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

export class OrchestrationStack extends cdk.Stack {
  public readonly compilationAgent: stepfunctions.StateMachine;
  public readonly recitationAgent: stepfunctions.StateMachine;
  public readonly compileRequestQueue: sqs.Queue;
  public readonly dlq: sqs.Queue;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DLQ for failed agent steps
    this.dlq = new sqs.Queue(this, 'RecitationDLQ', {
      queueName: 'oped-recitation-dlq',
    });

    // SQS FIFO Queue for decoupled Lesson Compilation
    this.compileRequestQueue = new sqs.Queue(this, 'CompileRequestQueue', {
      queueName: 'oped-compile-queue.fifo',
      fifo: true,
      contentBasedDeduplication: true,
    });

    // 1. Lesson Compilation Agent (Standard Workflow)
    const passCompile = new stepfunctions.Pass(this, 'CompilePass', {
      result: stepfunctions.Result.fromObject({ status: 'Mock compiled lesson' }),
    });

    this.compilationAgent = new stepfunctions.StateMachine(this, 'CompilationAgent', {
      definitionBody: stepfunctions.DefinitionBody.fromChainable(passCompile),
      stateMachineType: stepfunctions.StateMachineType.STANDARD,
    });

    // 2. Recitation Evaluation Agent (Express Workflow for low latency)
    const passEvaluate = new stepfunctions.Pass(this, 'EvaluatePass', {
      result: stepfunctions.Result.fromObject({ verdict: 'correct', confidence: 0.95 }),
    });

    this.recitationAgent = new stepfunctions.StateMachine(this, 'RecitationAgent', {
      definitionBody: stepfunctions.DefinitionBody.fromChainable(passEvaluate),
      stateMachineType: stepfunctions.StateMachineType.EXPRESS,
    });
  }
}
