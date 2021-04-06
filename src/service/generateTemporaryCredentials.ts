import AWS from 'aws-sdk';

export async function generateTemporaryCredentials(
  AWS_ACCESS_KEY_ID?: string,
  AWS_ACCESS_KEY_SECRET?: string
) {
  if(AWS_ACCESS_KEY_ID && AWS_ACCESS_KEY_SECRET){
    AWS.config.credentials = new AWS.Credentials({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_ACCESS_KEY_SECRET,
    });
  }

  const creds = await new AWS.STS()
    .getSessionToken({
      DurationSeconds: 900,
    })
    .promise();
  return creds;
}
