/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { User } from './User';

export type PostUpdate = {
  readonly id?: number;
  readonly url?: string;
  text?: string;
  readonly timestamp?: string;
  readonly author?: User;
};
