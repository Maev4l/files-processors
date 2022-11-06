/**
 * Deployment script into a parameterized CloudFront distribution
 */

const { execSync } = require('child_process');
const infra = require('../infra.json');

execSync(
  `deploy-aws-s3-cloudfront --source ./.dist --bucket ${infra.frontendBucket.value} --distribution ${infra.frontendDistribution.value} --invalidation-path "/*" --profile default --delete --non-interactive --cache-control index.html:no-cache`,
  { stdio: 'inherit' },
);
