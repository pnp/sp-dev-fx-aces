import * as React from 'react';
import { Icon, Stack, Text, useTheme } from '@fluentui/react';
import {
  CheckmarkCircle20Regular,
  Clock20Regular
} from '@fluentui/react-icons';

interface Props {
  completed: number;
  inProgress: number;
  total: number;
  statusColors: {
    completed: string;
    inProgress: string;
    notStarted: string;
  };
}

const TaskProgressBar: React.FC<Props> = ({ completed, inProgress, total, statusColors }) => {
  const theme = useTheme();

  const completedPercent = total > 0 ? completed / total : 0;
  const inProgressPercent = total > 0 ? inProgress / total : 0;
  const notStartedPercent = 1 - completedPercent - inProgressPercent;

  return (
    <Stack tokens={{ childrenGap: 4 }}>
      <div style={{
        height: 8,
        borderRadius: 8,
        overflow: 'hidden',
        display: 'flex',
        background: theme.palette.neutralLight
      }}>
        <div style={{ width: `${completedPercent * 100}%`, background: statusColors.completed }} />
        <div style={{ width: `${inProgressPercent * 100}%`, background: statusColors.inProgress }} />
        <div style={{ width: `${notStartedPercent * 100}%`, background: statusColors.notStarted }} />
      </div>

      <Stack horizontal horizontalAlign="space-between">
        <Text variant="tiny">
          <CheckmarkCircle20Regular style={{ marginRight: 4 }} />
          {Math.round(completedPercent * 100)}%
        </Text>
        <Text variant="tiny">
          <Clock20Regular style={{ marginRight: 4 }} />
          {Math.round(inProgressPercent * 100)}%
        </Text>
        <Text variant="tiny">
          <Icon iconName="CircleRing" style={{ marginRight: 4, fontSize: 16 }} />
          {Math.round(notStartedPercent * 100)}%
        </Text>
      </Stack>
    </Stack>
  );
};

export default TaskProgressBar;
