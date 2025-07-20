import * as React from 'react';
import { Stack, Text, useTheme } from '@fluentui/react';
import TaskProgressBar from './TaskProgressBar';

interface Props {
  name: string;
  completed: number;
  inProgress: number;
  total: number;
  onClick: () => void;
  colorMode?: 'white' | 'planner';
  index?: number;
  statusColors: {
    completed: string;
    inProgress: string;
    notStarted: string;
  };
}

// 🎨 Use exactly 3 planner colors, repeat after 3
const plannerColors = ['#107c10', '#ffb900', '#E0F4FC'];

const BucketCard: React.FC<Props> = ({
  name,
  completed,
  inProgress,
  total,
  onClick,
  colorMode = 'white',
  index = 0,
  statusColors
}) => {
  const theme = useTheme();

  const backgroundColor =
    colorMode === 'white'
      ? plannerColors[index % plannerColors.length]
      : '#FFFFFF';

  return (
    <Stack
      onClick={onClick}
      tokens={{ childrenGap: 8 }}
      styles={{
        root: {
          padding: 16,
          borderRadius: 12,
          backgroundColor,
          cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          position: 'relative',
          transition: 'transform 0.2s ease',
        }
      }}
    >
      {/* Top-right completed badge */}
      <Stack
        horizontalAlign="center"
        verticalAlign="center"
        styles={{
          root: {
            position: 'absolute',
            top: 10,
            right: 12,
            padding: '4px 10px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            background: 'rgba(0, 0, 0, 0.05)',
            color: '#333'
          }
        }}
      >
        {completed} done
      </Stack>

      <Text variant="large" styles={{ root: { fontWeight: 600 } }}>{name}</Text>
      <Text variant="small">{completed + inProgress} of {total} tasks started</Text>

      <TaskProgressBar completed={completed} inProgress={inProgress} total={total}  statusColors={statusColors}/>

      {/* See tasks button with Fluent icon */}
      <Stack horizontal horizontalAlign="end" styles={{ root: { marginTop: 8 } }}>
        <Stack horizontal tokens={{ childrenGap: 4 }} verticalAlign="center" style={{ cursor: 'pointer' }}>
          <Text
            variant="small"
            styles={{
              root: {
                color: theme.palette.themePrimary,
                fontWeight: 500,
              },
            }}
          >
            See tasks →
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default BucketCard;
