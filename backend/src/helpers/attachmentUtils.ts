import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

//GENERATE UPLOAD URL
//=====================
export const attachmentBucket = process.env.ATTACHMENT_S3_BUCKET
const UploadUrlExpiration = process.env.SIGNED_URL_EXPIRATION

const S3 = new XAWS.S3({

    signatureVersion: 'v4'
})

export const getAttachmentUploadUrl=(todoItemId: string)=> {

    const bucketParameters = {
        Bucket: attachmentBucket,
        Key: todoItemId,
        Expires: UploadUrlExpiration
    }

    const signedUploadUrl = S3.getSignedUrl('putObject', bucketParameters)

    return signedUploadUrl

}
