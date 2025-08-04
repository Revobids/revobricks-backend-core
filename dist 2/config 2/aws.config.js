"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'eu-north-1',
        s3: {
            bucketName: process.env.AWS_S3_BUCKET_NAME,
            endpoint: undefined,
            signedUrlExpiry: 3600,
        },
        cloudfront: {
            domain: process.env.AWS_CLOUDFRONT_DOMAIN,
        },
    },
});
//# sourceMappingURL=aws.config.js.map