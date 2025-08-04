declare const _default: () => {
    aws: {
        accessKeyId: string | undefined;
        secretAccessKey: string | undefined;
        region: string;
        s3: {
            bucketName: string | undefined;
            endpoint: undefined;
            signedUrlExpiry: number;
        };
        cloudfront: {
            domain: string | undefined;
        };
    };
};
export default _default;
