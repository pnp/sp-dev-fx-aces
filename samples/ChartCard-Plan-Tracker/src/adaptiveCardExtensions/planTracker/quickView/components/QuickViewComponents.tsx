import * as React from 'react';
import {
  Stack,
  Text,
  Icon,
  Pivot,
  PivotItem
} from '@fluentui/react';
import QuickAccessNav from './QuickAccessNav';
import TaskCard from './TaskCard';
import BucketCard from './BucketCard';
import ProjectMembersView from './ProjectMembersView';
import { SortDropdown } from './SortDropdown';
import { IPlannerBucket, IPlannerTask, IUser } from '../../services/PlannerService';
import { ISPFxAdaptiveCard } from '@microsoft/sp-adaptive-card-extension-base';
import { MessageBar, MessageBarType } from '@fluentui/react';

export interface IQuickViewComponentProps {
  tasks: IPlannerTask[];
  buckets: IPlannerBucket[];
  planId: string;
  tenantId: string;
  context: ISPFxAdaptiveCard;
  users: IUser[];
  statusColors: {
    completed: string;
    inProgress: string;
    notStarted: string;
  };
}

const QuickViewComponent: React.FC<IQuickViewComponentProps> = ({
  tasks,
  buckets,
  planId,
  tenantId,
  context,
  users,
  statusColors
}) => {
  const [selectedBucketId, setSelectedBucketId] = React.useState<string | null>(null);
  const [selectedPivot, setSelectedPivot] = React.useState<string>('planner');
  const [sortBy, setSortBy] = React.useState<string>('priority');

  const currentUserId = context?.pageContext?.aadInfo?.userId;

  const selectedBucket = React.useMemo(() => {
    return buckets.filter(b => b.id === selectedBucketId)[0] || null;
  }, [buckets, selectedBucketId]);

  const myTasks = React.useMemo(() => {
    return tasks.filter(task =>
      task.assignments &&
      currentUserId &&
      Object.prototype.hasOwnProperty.call(task.assignments, currentUserId)
    );
  }, [tasks, currentUserId]);

  const applySort = (taskList: IPlannerTask[]): IPlannerTask[] => {
    return [...taskList].sort((a, b) => {
      if (sortBy === 'priority') {
        return (a.priority ?? 3) - (b.priority ?? 3);
      } else if (sortBy === 'dueDate') {
        const aTime = a.dueDateTime ? new Date(a.dueDateTime).getTime() : Infinity;
        const bTime = b.dueDateTime ? new Date(b.dueDateTime).getTime() : Infinity;
        return aTime - bTime;
      }
      return 0;
    });
  };

  const sortedMyTasks = React.useMemo(() => applySort(myTasks), [myTasks, sortBy]);

  const sortedBucketTasks = React.useMemo(() => {
    return applySort(tasks.filter(t => t.bucketId === selectedBucketId));
  }, [tasks, selectedBucketId, sortBy]);

  const getBucketStats = React.useCallback((bucketId: string) => {
    const bucketTasks = tasks.filter(t => t.bucketId === bucketId);
    const completed = bucketTasks.filter(t => t.percentComplete === 100).length;
    const inProgress = bucketTasks.filter(t => t.percentComplete! > 0 && t.percentComplete! < 100).length;
    return { completed, inProgress, total: bucketTasks.length };
  }, [tasks]);

  return (
    <Stack tokens={{ childrenGap: 16, padding: 16 }}>
      <QuickAccessNav planId={planId} tenantId={tenantId} />

      <Pivot
        styles={{ root: { marginBottom: 16 } }}
        selectedKey={selectedPivot}
        onLinkClick={(item) => setSelectedPivot(item?.props.itemKey || 'planner')}
      >
        {/* PLANNER BUCKETS VIEW */}
        <PivotItem headerText="Planner Buckets" itemKey="planner">
          {selectedBucketId ? (
            <>
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                <Icon
                  iconName="Back"
                  styles={{
                    root: {
                      fontSize: 16,
                      cursor: 'pointer',
                      padding: 4,
                      borderRadius: 4,
                      selectors: { ':hover': { background: '#f3f3f3' } }
                    }
                  }}
                  onClick={() => setSelectedBucketId(null)}
                />
                <Text variant="xLarge">{selectedBucket?.name}</Text>
              </Stack>

              <Stack styles={{ root: { marginTop: 12, marginBottom: 12 } }}>
                <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
              </Stack>

              <Stack tokens={{ childrenGap: 16  }}>
                {sortedBucketTasks.map(task => (
                  <TaskCard key={task.id} task={task} tenantId={tenantId} statusColors={statusColors} />
                ))}
              </Stack>
            </>
          ) : (
            <Stack tokens={{ childrenGap: 16 }}>
              {buckets.map((bucket, i) => {
                const { completed, inProgress, total } = getBucketStats(bucket.id);
                return (
                  <BucketCard
                    key={bucket.id}
                    name={bucket.name}
                    completed={completed}
                    inProgress={inProgress}
                    total={total}
                    onClick={() => setSelectedBucketId(bucket.id)}
                    colorMode="planner"
                    index={i}
                    statusColors={statusColors}
                  />
                );
              })}
            </Stack>
          )}
        </PivotItem>

        {/* MY TASKS VIEW */}
        <PivotItem headerText="My Tasks" itemKey="myTasks">
          <Stack tokens={{ childrenGap: 12 }}>
            <MessageBar
              messageBarType={MessageBarType.info}
              isMultiline={true}
              dismissButtonAriaLabel="Close"
            >
              The tasks shown here are only those assigned to you in this plan.
            </MessageBar>
            <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
            {sortedMyTasks.length > 0 ? (
              sortedMyTasks.map(task => (
                <TaskCard key={task.id} task={task} tenantId={tenantId} statusColors={statusColors} />
              ))
            ) : (
              <Text variant="medium" styles={{ root: { color: '#605e5c', marginTop: 12 } }}>
                No tasks available.
              </Text>
            )}
          </Stack>
        </PivotItem>

        {/* PROJECT MEMBERS VIEW */}
        <PivotItem headerText="Project Members" itemKey="members">
          <Stack tokens={{ padding: 16 }}>
            <ProjectMembersView users={users} />
          </Stack>
        </PivotItem>
      </Pivot>
    </Stack>
  );
};

export default QuickViewComponent;
