import * as React from 'react';
import { Dropdown, IDropdownOption } from '@fluentui/react';
import { Stack } from '@fluentui/react';

interface SortDropdownProps {
  sortBy: string;
  setSortBy: (key: string) => void;
}

const options: IDropdownOption[] = [
  { key: 'priority', text: 'Priority' },
  { key: 'dueDate', text: 'Due Date' }
];

export const SortDropdown: React.FC<SortDropdownProps> = ({ sortBy, setSortBy }) => (
  <Stack horizontalAlign="center">
    <Dropdown
      label="Sort by"
      selectedKey={sortBy}
      onChange={(_, option) => setSortBy(option?.key as string)}
      options={options}
      styles={{ root: { width: '95%', marginBottom: '12px' } }}
    />
  </Stack>
);