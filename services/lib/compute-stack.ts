import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';

export class ComputeStack extends cdk.Stack {
  public readonly fargateService: ecs.FargateService;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC with only public subnets to avoid expensive NAT Gateways for the hackathon
    const vpc = new ec2.Vpc(this, 'OpedVpc', {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        }
      ]
    });

    const cluster = new ecs.Cluster(this, 'OpedCluster', {
      vpc: vpc,
      clusterName: 'oped-compute-cluster'
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'RecitationTask', {
      memoryLimitMiB: 1024,
      cpu: 512,
    });

    // Mock container for now. In a real scenario, this is the Node.js/Express Recitation Engine.
    const container = taskDefinition.addContainer('RecitationContainer', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'RecitationEngine' }),
      portMappings: [{ containerPort: 80 }]
    });

    // Deploy Fargate Service in Public Subnet with public IP enabled (since we have no NAT)
    this.fargateService = new ecs.FargateService(this, 'RecitationService', {
      cluster,
      taskDefinition,
      desiredCount: 2, // Always warm (kills cold-start jitter)
      assignPublicIp: true,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }
    });

    // Internal ALB to front the Fargate tasks (to be linked to API Gateway via VPC Link later)
    const alb = new elbv2.ApplicationLoadBalancer(this, 'RecitationAlb', {
      vpc,
      internetFacing: false, // Internal only
    });

    const listener = alb.addListener('HttpListener', {
      port: 80,
    });

    listener.addTargets('RecitationTarget', {
      port: 80,
      targets: [this.fargateService],
      healthCheck: {
        path: '/',
        interval: cdk.Duration.seconds(30),
      }
    });
  }
}
