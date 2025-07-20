import * as React from 'react';
import { Stack, Text, Icon } from '@fluentui/react';

interface Props {
    planId: string;
    tenantId: string;
}

const QuickAccessNav: React.FC<Props> = ({ planId, tenantId }) => {
    const items = [
        { key: 'plan', label: 'Plan', icon: 'PlanView', view: 'plan' },
        { key: 'timeline', label: 'Raster', icon: 'GridViewSmall', view: 'timeline' },
        { key: 'board', label: 'Board', icon: 'Tiles', view: 'board' },
        { key: 'schedule', label: 'Schedule', icon: 'TimelineProgress', view: 'schedule' },
        { key: 'charts', label: 'Charts', icon: 'ProjectCollection', view: 'charts' },
    ];

    return (
        <Stack tokens={{ childrenGap: 16 }}>
            <Stack horizontal tokens={{ childrenGap: 20 }}>
                {items.map(item => {
                    const url = `https://planner.cloud.microsoft/webui/plan/${planId}/view/${item.view}?tid=${tenantId}`;
                    return (
                        <a
                            key={item.key}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <Stack
                                horizontalAlign="center"
                                styles={{
                                    root: {
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease',
                                        padding: 8,
                                        borderRadius: 8,
                                        selectors: {
                                            ':hover': {
                                                background: '#f3f3f3',
                                                transform: 'scale(1.05)',
                                            },
                                        },
                                    }
                                }}
                            >
                                <Icon iconName={item.icon} styles={{ root: { fontSize: 20, marginBottom: 4 } }} />
                                <Text variant="small">{item.label}</Text>
                            </Stack>
                        </a>
                    );
                })}
            </Stack>
        </Stack>
    );
};

export default QuickAccessNav;
