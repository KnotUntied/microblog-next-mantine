/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DateTimePagination } from './DateTimePagination';
import type { Post } from './Post';

export type PaginatedPost = {
  pagination?: DateTimePagination;
  data?: Array<Post>;
};
