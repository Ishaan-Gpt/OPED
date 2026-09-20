#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { StorageStack } from '../lib/storage-stack';
import { ApiStack } from '../lib/api-stack';
import { OrchestrationStack } from '../lib/orchestration-stack';
import { MessagingStack } from '../lib/messaging-stack';
import { ComputeStack } from '../lib/compute-stack';

const app = new cdk.App();

const storageStack = new StorageStack(app, 'OpedStorageStack', {});

const orchestrationStack = new OrchestrationStack(app, 'OpedOrchestrationStack', {});

new ApiStack(app, 'OpedApiStack', {
  storageStack,
  orchestrationStack,
});

new MessagingStack(app, 'OpedMessagingStack', {});

new ComputeStack(app, 'OpedComputeStack', {});
