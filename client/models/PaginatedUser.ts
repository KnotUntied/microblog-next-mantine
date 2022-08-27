/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StringPagination } from './StringPagination';
import type { User } from './User';

export type PaginatedUser = {
  pagination?: StringPagination;
  data?: Array<User>;
};
