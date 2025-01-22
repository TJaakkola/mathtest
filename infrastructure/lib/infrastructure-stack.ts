import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfrontOrigins from 'aws-cdk-lib/aws-cloudfront-origins';


export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 bucket for static website
    const mathTestBucket = new s3.Bucket(this, 'math-test-bucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // CloudFront
    const distribution = new cloudfront.Distribution(this, 'MathTestDistribution', {
      defaultBehavior: {
        origin: new cloudfrontOrigins.S3Origin(mathTestBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
    });

    // S3-tiedostojen deploy
    // new s3Deployment.BucketDeployment(this, 'DeployWebsite', {
    //   sources: [s3Deployment.Source.asset('../path-to-your-vite-build-folder')],
    //   destinationBucket: mathTestBucket,
    //   distribution,
    //   distributionPaths: ['/*'],
    // });

    new cdk.CfnOutput(this, 'BucketName', {
      value: mathTestBucket.bucketName,
    });
    new cdk.CfnOutput(this, 'CloudFrontURL', {
      value: distribution.distributionDomainName,
    });

    cdk.Tags.of(this).add('Project', 'math-test');
  }
}
