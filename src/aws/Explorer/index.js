import AWS from 'aws-sdk';
import * as exporter from './exporter';

AWS.config.region = process.env.AWS_REGION;

export default exporter;
