# aws-backend

Backend plugin that generates temporary credentials in order to perform requests to aws services from backstage's frontend

## Usage

This is how you set api keys when using aws sdk:

```js
async function generateCredentials(backendUrl: string) {
  const resp = await (await fetch(`${backendUrl}/aws/credentials`)).json();
  return new AWS.Credentials({
    accessKeyId: resp.AccessKeyId,
    secretAccessKey: resp.SecretAccessKey,
    sessionToken: resp.SessionToken,
  });
}
AWS.config.credentials = await generateCredentials(backendUrl);
```

## Starting the Auth Backend

Please create an IAM user (with api keys capabilities) with permissions as little as possible to perform actions from backstage (e.g. only operation lambda:GetFunction with specified resource list)

then, please set environment variables with api keys from previously create IAM user.

Then run plugin as standalone:

```bash
export AWS_ACCESS_KEY_ID=x
export AWS_ACCESS_KEY_SECRET=x
yarn start
```

or add it to backstage:

```js
// packages/backend/src/plugins/aws.ts

import { createRouter } from '@roadiehq/backstage-plugin-aws-auth';
import type { PluginEnvironment } from '../types';

export default async function createPlugin({ logger }: PluginEnvironment) {
  return await createRouter(logger);
}
```

```js
// packages/backend/src/index.ts

import aws from './plugins/aws';
...
const awsEnv = useHotMemoize(module, () => createEnv('aws'));
...
const apiRouter = Router();
...
apiRouter.use('/aws', await aws(awsEnv));
```
