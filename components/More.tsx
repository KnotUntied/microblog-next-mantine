import { Button, Group } from '@mantine/core';
import { IconChevronsRight } from '@tabler/icons';
import { DateTimePagination } from '../client';

interface MoreProps {
  pagination?: DateTimePagination,
  loadNextPage: () => void,
}

export default function More({ pagination, loadNextPage }: MoreProps) {
  let thereAreMore = false;
  if (pagination) {
    const { offset, count, total } = pagination;
    console.log({ offset, count, total });
    thereAreMore = (offset ?? 0) + (count ?? 0) < (total ?? 0);
  }

  return (
    <Group position="right">
      {thereAreMore &&
        <Button onClick={loadNextPage} rightIcon={<IconChevronsRight />}>More</Button>
      }
    </Group>
  );
}