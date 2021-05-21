/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import express from 'express';
import { Logger } from 'winston';
import { generateTemporaryCredentials } from './generateTemporaryCredentials';

export type LambdaData = {
  region: string;
  functionName: string;
  codeSize: number;
  description: string;
  lastModifiedDate: string;
  runtime: string;
  memory: number;
};

export function getAwsApiGenerateTempCredentialsForwarder({
  AWS_ACCESS_KEY_ID,
  AWS_ACCESS_KEY_SECRET,
  AWS_ROLE_ARN,
  logger,
}: {
  AWS_ACCESS_KEY_ID?: string,
  AWS_ACCESS_KEY_SECRET?: string,
  AWS_ROLE_ARN?: string,
  logger: Logger,
}
) {
  return async function forwardRequest(
    _: express.Request,
    response: express.Response
  ) {
    try {
      const credentials = await generateTemporaryCredentials(
        AWS_ACCESS_KEY_ID,
        AWS_ACCESS_KEY_SECRET,
        AWS_ROLE_ARN
      );
      return response.json(credentials.Credentials);
    } catch (e) {
      logger.error(e);
      return response.status(500).json({ message: e.message });
    }
  };
}
