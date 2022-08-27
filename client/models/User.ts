/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type User = {
  readonly id?: number;
  readonly url?: string;
  username: string;
  email: string;
  password: string;
  readonly avatar_url?: string;
  about_me?: string | null;
  readonly first_seen?: string | null;
  readonly last_seen?: string | null;
  readonly posts_url?: string;
};
