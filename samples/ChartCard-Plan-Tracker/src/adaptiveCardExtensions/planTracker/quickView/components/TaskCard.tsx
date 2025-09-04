import * as React from 'react';
import { Stack, Text, Icon, Link } from '@fluentui/react';
import { IPlannerTask } from '../../services/PlannerService';

interface ITaskCardProps {
  task: IPlannerTask;
  tenantId: string;
  statusColors: {
    completed: string;
    inProgress: string;
    notStarted: string;
  };
}

const getStatus = (
  percentComplete: number,
  statusColors: ITaskCardProps['statusColors']
): { label: string; color: string; icon: string } => {
  if (percentComplete === 100) {
    return { label: 'Completed', color: statusColors.completed, icon: 'CheckMark' };
  }
  if (percentComplete > 0) {
    return { label: 'In Progress', color: statusColors.inProgress, icon: 'ProgressRingDots' };
  }
  return { label: 'Not Started', color: statusColors.notStarted, icon: 'CircleRing' };
};

const getPriorityLabel = (priority?: number): string => {
  switch (priority) {
    case 0: return 'Urgent';
    case 1: return 'Important';
    case 2: return 'Medium';
    case 3: return 'Low';
    default: return 'Normal';
  }
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

const TaskCard: React.FC<ITaskCardProps> = ({ task, tenantId, statusColors }) => {
  const statusInfo = React.useMemo(
    () => getStatus(task.percentComplete || 0, statusColors),
    [task.percentComplete, statusColors]
  );

  const priorityLabel = React.useMemo(() => getPriorityLabel(task.priority), [task.priority]);
  const startDate = React.useMemo(() => formatDate(task.startDateTime), [task.startDateTime]);
  const dueDate = React.useMemo(() => formatDate(task.dueDateTime), [task.dueDateTime]);
  const plannerUrl = `https://tasks.office.com/${tenantId}/en-US/Home/Task/${task.id}`;

  return (
    <Stack
      horizontal
      verticalAlign="center"
      tokens={{ childrenGap: 16 }}
      styles={{
        root: {
          padding: 16,
          borderRadius: 12,
          background: '#fff',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          borderLeft: `4px solid ${statusInfo.color}`,
          justifyContent: 'space-between',
          alignItems: 'center',
        }
      }}
    >
      <Stack tokens={{ childrenGap: 6 }} styles={{ root: { flexGrow: 1 } }}>
        <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>{task.title}</Text>
        <Text variant="small" styles={{ root: { color: '#605e5c' } }}>Priority: {priorityLabel}</Text>

        {startDate && <Text variant="small" styles={{ root: { color: '#605e5c' } }}>Start: {startDate}</Text>}
        {dueDate && <Text variant="small" styles={{ root: { color: '#605e5c' } }}>Due: {dueDate}</Text>}

        <Stack
          horizontal
          verticalAlign="center"
          styles={{
            root: {
              marginTop: 4,
              justifyContent: 'space-between',
              width: '100%',
            }
          }}
        >
          <Stack
            horizontal
            verticalAlign="center"
            tokens={{ childrenGap: 6 }}
            styles={{
              root: {
                background: statusInfo.color + '22',
                borderRadius: 16,
                padding: '4px 10px',
                width: 'fit-content'
              }
            }}
          >
            <Icon iconName={statusInfo.icon} styles={{ root: { color: statusInfo.color, fontSize: 14 } }} />
            <Text variant="small" styles={{ root: { color: statusInfo.color, fontWeight: 500 } }}>{statusInfo.label}</Text>
          </Stack>

          <Link
            href={plannerUrl}
            target="_blank"
            styles={{ root: { fontWeight: 500, fontSize: 14, whiteSpace: 'nowrap' } }}
          >
            see task →
          </Link>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default React.memo(TaskCard);
