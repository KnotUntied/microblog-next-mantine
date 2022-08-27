/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { User } from './User';

export type Post = {
  readonly id?: number;
  readonly url?: string;
  text: string;
  readonly timestamp?: string;
  readonly author?: User;
};
