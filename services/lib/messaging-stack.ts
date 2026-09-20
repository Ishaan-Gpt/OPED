import * as cdk from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';

export class MessagingStack extends cdk.Stack {
  public readonly strugglingStudentTopic: sns.Topic;
  public readonly masteryReportTopic: sns.Topic;
  public readonly opsAlertTopic: sns.Topic;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.strugglingStudentTopic = new sns.Topic(this, 'StrugglingStudentTopic', {
      displayName: 'OPED Struggling Student Alerts',
      topicName: 'oped-struggling-student-alerts',
    });

    // Add email subscriptions for the hackathon team
    const emails = [
      'ishaangupta011205@gmail.com',
      'keshavhack13@gmail.com',
      'logintoai13@gmail.com'
    ];

    for (const email of emails) {
      this.strugglingStudentTopic.addSubscription(
        new subscriptions.EmailSubscription(email)
      );
    }

    this.masteryReportTopic = new sns.Topic(this, 'MasteryReportTopic', {
      displayName: 'OPED Daily Mastery Reports',
      topicName: 'oped-mastery-reports',
    });

    this.opsAlertTopic = new sns.Topic(this, 'OpsAlertTopic', {
      displayName: 'OPED Ops and Error Alerts',
      topicName: 'oped-ops-alerts',
    });
  }
}
